import { getItems, getUserFromDatabase } from '@/lib/appwrite';
import React, { useEffect } from 'react'
import { View, Text, FlatList } from 'react-native'
import { useAppwrite } from '@/lib/useAppwrite';
import { useLocalSearchParams } from 'expo-router';

export default function MyListings() {
const { userId} = useLocalSearchParams<{userId?: string}>(); 
 const { data, refetch, loading } = useAppwrite({
      fn: getItems,
      params: { userId },
    
    });
  
  return (
    <View>
      <FlatList
        data={data || []}
        renderItem={({ item }) => <Text>{item.$id}</Text>}
        keyExtractor={(item) => item.$id}
      />
    </View>
  )
}