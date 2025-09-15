import { View, StyleSheet, FlatList, Text, TouchableOpacity, Modal, Dimensions, RefreshControl } from 'react-native';
import Slider from '@react-native-community/slider';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { router } from 'expo-router';
import { getCurrentUser, getLocation, logout } from '../../lib/appwrite';
import { COLORS, FONT, SPACING, RADIUS } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '@/components/SearchBar';
import { useLocalSearchParams } from 'expo-router';
import { useAppwrite } from '@/lib/useAppwrite';
import { getItems } from '@/lib/appwrite';
import Filter from '@/components/Filter';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import ItemCard from '@/components/ItemCard';
import { Item } from '@/type';
import { getDistanceFromLatLonInKm } from '@/utils/calculateDistance';
import { DistanceChooser } from '@/components/DistanceChooser';

// Add missing FONTS constant if not already defined in your theme
const FONTS = {
  h3: {
    fontSize: 18,
    fontWeight: '600',
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
  },
};

const { width, height } = Dimensions.get('window');

// Calculate item height based on screen width
const ITEM_HEIGHT = (width / 2) * 1.4; // Adjust this based on your item's aspect ratio

export default function Home() {
  const { category, query } = useLocalSearchParams<{category?: string, query?: string}>();
  const { data, refetch, loading } = useAppwrite({
    fn: getItems,
    params: { category, query },
    skip: !category && !query
  });
  useEffect(() => {
    refetch({ category, query });
  }, [category, query]);

  const [location, setLocation] = useState<{latitude: number, longitude: number, postalCode?: string} | null>(null);
  const [locationText, setLocationText] = useState<string>('Loading...');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showDistanceFilter, setShowDistanceFilter] = useState(false);
  const [distance, setDistance] = useState(10); // Default 10km
  const [filteredData, setFilteredData] = useState<Item[]>([]);

  useEffect(() => {
    async function getCurrentLocation() {
        
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      const position = await Location.getCurrentPositionAsync({});
      const postalCode = await Location.reverseGeocodeAsync(position.coords);
      const locationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        postalCode: postalCode[0]?.postalCode || 'Unknown'
      };
      setLocation(locationData);
      setLocationText(locationData.postalCode || 'Your Location');
      }
  
    getCurrentLocation();
  }, []);

  const filterItemsByDistance = useCallback((items: Item[], userLocation: {latitude: number, longitude: number}, maxDistance: number) => {
    if (!items || !userLocation) return [];
    
    return items.filter(item => {
      // Use coordinates from location object if available, otherwise use direct props
      const itemLat = item.latitude ?? item.latitude;
      const itemLng = item.longitude ?? item.longitude;
      
      if (itemLat === undefined || itemLng === undefined) return false;
      
      const itemLocation = {
        latitude: typeof itemLat === 'string' ? parseFloat(itemLat) : itemLat,
        longitude: typeof itemLng === 'string' ? parseFloat(itemLng) : itemLng
      };
      
      const distance = getDistanceFromLatLonInKm(
        userLocation,
        itemLocation
      );
      
      return distance <= maxDistance;
    });
  }, []);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const response = await getItems({});
      const items = (response as unknown as any[]).map((item) => ({
        ...item,
        latitude: item.latitude,
        longitude: item.longitude
      })) as Item[];
      
      refetch({ category, query });
      
      if (location) {
        const filtered = filterItemsByDistance(items, location, distance);
        setFilteredData(filtered);
      } else {
        setFilteredData(items);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (data && location) {
      const items = (data as unknown as any[]).map((item) => ({
        ...item,
        latitude: item.latitude,
        longitude: item.longitude
      })) as Item[];
      const filtered = filterItemsByDistance(items, location, distance);
      setFilteredData(filtered);
    }
  }, [data, location, distance, filterItemsByDistance]);

  const onRefresh = useCallback(() => {
    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
      <View style={styles.searchSection}>
              <SearchBar />
            </View>

            {/* Filter Section */}
            <View style={styles.filterSection}>
              <View style={styles.filterRow}>
                <Filter />
         
              <View style={styles.locationContainer}>
                <View style={styles.locationRow}>
                  <Ionicons name="location" size={20} color={COLORS.accent} />
                  <Text style={styles.locationText}>{locationText}</Text>
                </View>
                <View style={styles.distanceContainer}>
                  <DistanceChooser 
                    selectedDistance={distance}
                    onDistanceChange={setDistance}
                    visible={true}
                    onClose={() => {}}
                  />
                </View>
              </View>
              </View>
          </View>
      </View>
      <FlatList
        data={filteredData.length > 0 ? filteredData : (data as unknown as Item[])}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.accent]}
            tintColor={COLORS.accent}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            {/* Search Section */}
  
            {/* Non Sticky Header. this start should be stay in place at top */}
          <View style={styles.stickyHeader}>
            <View style={styles.sectionHeader}>
              <View>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
          <View>
            <Text style={styles.sectionTitle}>Today's Pick</Text>
            <Text style={styles.sectionSubtitle}>{filteredData?.length || 0} Freebies found</Text>
          </View>
        </View>
              </View>
        
            </View>
          </View>
            

          </View>
        }
        
        // StickyHeaderComponent={() => (
        //   <View style={styles.stickyHeader}>
        //     <View style={styles.sectionHeader}>
        //       <View>
        //         <Text style={styles.sectionTitle}>Today's Pick</Text>
        //         <Text style={styles.sectionSubtitle}>{data?.length || 0} Freebies found</Text>
        //       </View>
        //       <View style={styles.locationRow}>
        //         <Ionicons name="location" size={20} color={COLORS.accent} />
        //         <Text style={styles.locationText}>{location}</Text>
        //       </View>
        //     </View>
        //   </View>
        // )}
        // Performance optimizations
        initialNumToRender={4} // Reduce initial render count
        maxToRenderPerBatch={4} // Reduce number of items rendered per batch
        updateCellsBatchingPeriod={100} // Time between batch renders
        windowSize={5} // Reduce the window size
        removeClippedSubviews={true} // Unmount offscreen views
        keyExtractor={(item) => item.$id} // Use $id instead of id
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        renderItem={useCallback(({ item, index }: { item: Item; index: number }) => (
          <View style={[styles.itemCard, index % 2 === 0 ? { marginRight: SPACING.sm } : { marginLeft: SPACING.sm }]}>
            <ItemCard item={item} />
          </View>
        ), [])}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="search-outline" size={64} color={COLORS.gray} />
            </View>
            <Text style={styles.emptyStateTitle}>No items found</Text>
            <Text style={styles.emptyStateText}>
              Try adjusting your search terms or browse different categories
            </Text>

          </View>
        }
      
        numColumns={2}
      />
      <Modal
        visible={showDistanceFilter}
        transparent={true}
        onRequestClose={() => setShowDistanceFilter(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Distance Filter</Text>
            <Text style={styles.distanceValue}>{distance} km</Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={50}
              step={1}
              value={distance}
              onValueChange={setDistance}
            />
            <View style={styles.sliderLabels}>
              <Text>1 km</Text>
              <Text>50 km</Text>
            </View>
            <TouchableOpacity style={styles.applyButton} onPress={() => setShowDistanceFilter(false)}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingBottom: 32,
  },
  header: {
    gap: 1,
    marginBottom: 0,
    paddingHorizontal: SPACING.md,
  },
  
  
  // Location Section

  locationContainer: {
    flex: 1,
    marginLeft: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 44, // Match the height of the Filter component
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingLeft: 4,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 6,
    fontFamily: FONT.family.medium,
  },

  // Search and Filter
  searchSection: {
    marginTop: 0,
  },
  filterSection: {
    marginBottom: SPACING.md,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    height: 44, // Explicit height for the row
  },

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '500',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  seeAllText: {
    color: COLORS.accent,
    fontWeight: '600',
    fontSize: 14,
    marginRight: 4,
  },

  // Sticky Header
  stickyHeader: {
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    width: '100%',
  },
  distanceContainer: {
    marginLeft: 'auto',
  },
  distanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
  },
  distanceText: {
    color: COLORS.text,
    marginLeft: 4,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
    color: COLORS.text,
  },
  distanceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginBottom: SPACING.lg,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: SPACING.sm,
    marginTop: SPACING.xs,
  },
  applyButton: {
    backgroundColor: COLORS.accent,
    padding: SPACING.md,
    borderRadius: 8,
    marginTop: SPACING.lg,
    width: '100%',
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // Item Cards
  itemCard: {
    flex: 1,
    width: '50%',  // Slightly less than 50% to account for spacing
    marginBottom: SPACING.sm,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    backgroundColor: COLORS.gray + '15',
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  emptyStateButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
  },
});