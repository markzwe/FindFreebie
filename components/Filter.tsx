import { View, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { COLORS } from '@/constants/theme';
import { filerDataTypes } from '@/constants';
import CustomPicker from './CustomPicker';

export default function Filter() {

  const searchParams = useLocalSearchParams<{category?: string}>();
  const [active, setActive] = useState(searchParams.category || "all")

  const handlePress = (id: string) => {
    // Update local state to show which button is active
    setActive(id);
    
    // Update URL parameters to reflect the selected category
    if (id === 'all') {
        // If "All" is selected, remove category filter from URL
        router.setParams({category: undefined});
    } else {
        // If a specific category is selected, add it to URL
        router.setParams({category:id})
    }
}

  return (
    <View style={styles.container}>
      <CustomPicker
        items={filerDataTypes}
        selectedValue={active}
        onValueChange={handlePress}
        placeholder="Select a category"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 150, // Fixed width for compact size
    height: 44, // Match the height of the location container
    justifyContent: 'center',
  } as const,
})