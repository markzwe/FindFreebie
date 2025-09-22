import { getItems, getUserFromDatabase } from '@/lib/appwrite';
import React, { useCallback, useEffect } from 'react'
import { View, Text, FlatList, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native'
import { useAppwrite } from '@/lib/useAppwrite';
import { router, useLocalSearchParams } from 'expo-router';
import { COLORS, SIZES, SPACING } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import ItemCard from '@/components/ItemCard';
import { Item } from '@/type';
import { SafeAreaView } from 'react-native-safe-area-context';

// Height of each item in the list (image height + padding + margins + title height)
const ITEM_HEIGHT = 200; // Adjust this value based on your actual item height

export default function MyListings() {
  const params = useLocalSearchParams();
  const userId = params.userID as string; // Match the parameter name from the route
  console.log("User ID:", userId);
  const { data, refetch, loading } = useAppwrite({
    fn: getItems,
    params: { userId },
  });
    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = useCallback(async () => {
      setRefreshing(true);
      await refetch({ userId: userId });
      setRefreshing(false);
    }, [refetch, userId]);
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={data as unknown as Item[]}
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
        stickyHeaderIndices={[0]}
        stickyHeaderHiddenOnScroll={true}
        ListHeaderComponent={
          <View style={styles.headerContainer}>

            {/* Background decoration */}
            <View style={styles.backgroundDecoration}>
              <View style={styles.decorativeCircle1} />
              <View style={styles.decorativeCircle2} />
            </View>
            
            {/* Main header content */}
            <View style={styles.headerContent}>
              <View style={styles.headerTopRow}>
                <TouchableOpacity 
                  onPress={() => router.back()} 
                  style={styles.backButton}
                  activeOpacity={0.7}
                >  
                  <Ionicons name="arrow-back" size={18} color={COLORS.text} />
                </TouchableOpacity>
                
                <View style={styles.titleContainer}>
                  <Text style={styles.headerTitle}>My Listings</Text>
                  <View style={styles.titleUnderline} />
                </View>
                
                <View style={styles.headerActions}>
                  <TouchableOpacity style={styles.actionButton} activeOpacity={0.7} onPress={() => router.push('/(tabs)/addItem')}>
                    <Ionicons name="add" size={20} color={COLORS.accent} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        }
        
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
              <Ionicons name="cube-outline" size={48} color={COLORS.gray} />
            </View>
            <Text style={styles.emptyStateTitle}>No Listings Yet</Text>
            <Text style={styles.emptyStateText}>
              Start sharing items with your community by creating your first listing
            </Text>
            <TouchableOpacity style={styles.createButton} activeOpacity={0.8}>
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.createButtonText}>Create Listing</Text>
            </TouchableOpacity>
          </View>
        }
        numColumns={2}
      />
    </SafeAreaView>
  )
}

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  
  // Header Styles
  headerContainer: {
    position: 'relative',
    backgroundColor: COLORS.background,
    width: '100%',
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    // Add a subtle border at the bottom when sticky
    borderBottomWidth: 1,
    borderBottomColor: `${COLORS.border}80`,
  },
  
  // Background decoration
  backgroundDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -30,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${COLORS.accent}08`,
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -40,
    left: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `${COLORS.accent}05`,
  },
  
  headerContent: {
    position: 'relative',
    zIndex: 2,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // Back button
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // Title section
  titleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  titleUnderline: {
    width: 40,
    height: 3,
    backgroundColor: COLORS.accent,
    borderRadius: 2,
  },
  
  // Header actions
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${COLORS.accent}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
  
  // Stats section
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: `${COLORS.accent}08`,
    borderRadius: 12,
    padding: SPACING.sm,
    alignSelf: 'flex-start',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    marginRight: 6,
  },
  statNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  
  // Item cards
  itemCard: {
    flex: 1,
    marginBottom: SPACING.md,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  
  // Empty state
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl * 2,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: `${COLORS.gray}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 2,
    borderColor: `${COLORS.gray}20`,
    borderStyle: 'dashed',
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.xl,
    maxWidth: 280,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 25,
    shadowColor: COLORS.accent,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: SPACING.xs,
  },
  
  // Location styles (keeping existing ones)
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: COLORS.gray,
    marginLeft: SPACING.xs,
  },
});