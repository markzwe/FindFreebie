import { getItems, getUserFromDatabase } from '@/lib/appwrite';
import React, { useCallback, useEffect } from 'react'
import { View, Text, FlatList, RefreshControl, StyleSheet } from 'react-native'
import { useAppwrite } from '@/lib/useAppwrite';
import { useLocalSearchParams } from 'expo-router';
import { COLORS, SIZES, SPACING } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import ItemCard from '@/components/ItemCard';
import { Item } from '@/type';
import { SafeAreaView } from 'react-native-safe-area-context';

// Height of each item in the list (image height + padding + margins + title height)
const ITEM_HEIGHT = 200; // Adjust this value based on your actual item height

export default function MyListings() {
const { userId} = useLocalSearchParams<{userId?: string}>(); 
 const { data, refetch, loading } = useAppwrite({
      fn: getItems,
      params: { userId: userId || '' },
    });
    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = useCallback(async () => {
      setRefreshing(true);
      await refetch({ userId: userId || '' });
      setRefreshing(false);
    }, [refetch, userId]);
  
  return (
    <SafeAreaView>
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
            <Text style={styles.sectionSubtitle}>{data?.length || 0} Freebies found</Text>
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
    </SafeAreaView>
  )
}



  export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    content: {
      padding: SPACING.md,
    },
    header: {
      marginBottom: SPACING.md,
    },
    stickyHeader: {
      backgroundColor: COLORS.background,
      paddingTop: SPACING.md,
      paddingBottom: SPACING.sm,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SPACING.md,
    },
    sectionTitle: {
      color: COLORS.text,
      marginBottom: SPACING.xs,
    },
    sectionSubtitle: {
      color: COLORS.gray,
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    locationText: {
      color: COLORS.gray,
      marginLeft: SPACING.xs,
    },
    itemCard: {
      flex: 1,
      marginBottom: SPACING.md,
      borderRadius: SIZES.sm,
      backgroundColor: COLORS.surface,
      shadowColor: COLORS.gray,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      overflow: 'hidden',
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: SPACING.xl,
      marginTop: SPACING.xxl,
    },
    emptyIconContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: COLORS.lightGray,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: SPACING.md,
    },
    emptyStateTitle: {
      color: COLORS.text,
      marginBottom: SPACING.xs,
      textAlign: 'center',
    },
    emptyStateText: {
      color: COLORS.gray,
      textAlign: 'center',
      lineHeight: 20,
    },
  });
  