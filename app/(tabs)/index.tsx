import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { getCurrentUser, getLocation, logout } from '../../lib/appwrite';
import { COLORS } from '../../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '@/components/SearchBar';
import { useLocalSearchParams } from 'expo-router';
import { useAppwrite } from '@/lib/useAppwrite';
import { getItems } from '@/lib/appwrite';
import Filter from '@/components/Filter';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

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

    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
    useEffect(() => {
      async function getCurrentLocation() {
        
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
  
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      }
  
      getCurrentLocation();
    }, []);



  console.log('location', location);
  
  
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data || []}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            {/* Search Section */}
            <View style={styles.searchSection}>
              <SearchBar />
            </View>

            {/* Filter Section */}
            <View style={styles.filterSection}>
              <Filter />
            </View>
            
            {/* Section Header */}
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Today's Pick</Text>
                <Text style={styles.sectionSubtitle}>{data?.length || 0} Freebies found</Text>
              </View>
              <View style={styles.locationRow}>
                <Ionicons name="location" size={20} color={COLORS.accent} />
                  <Text style={styles.locationText}>45409</Text>
                </View>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            {/* Your item card content will go here */}
            <Text>Item Card</Text>
          </View>
        )}
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
        numColumns={1}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  header: {
    gap: 10,
    marginBottom: 8,
  },
  
  
  // Location Section

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.accent,
    marginRight: 8,
  },

  // Search and Filter
  searchSection: {
    marginTop: 0,
  },
  filterSection: {
    marginTop: 0,
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

  // Item Cards
  itemCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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