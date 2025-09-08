import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { Category } from '@/type'
import { router, useLocalSearchParams } from 'expo-router'
import { COLORS } from '@/constants/theme';
import { filerDataTypes } from '@/constants';

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
      {filerDataTypes.map((item) => (
        <TouchableOpacity
         key = {item.id}
         style = {[
           styles.chip,
           active === item.id && styles.activeChip
         ]}
         onPress = {() => handlePress(item.id)}
         >
           <Text style={[
             styles.chipText,
             active === item.id && styles.activeChipText
           ]}>
              {item.name}
            </Text>
        </TouchableOpacity>
      ))}
    </View>
)
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 12,
    justifyContent: 'space-between'
  },
  chip: {
    paddingHorizontal: Dimensions.get('window').width * 0.09,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: '#F8F9FA',    
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  activeChip: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
    shadowColor: COLORS.accent,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#495057',
    textAlign: 'center',
  },
  activeChipText: {
    color: COLORS.background,
    fontWeight: '600',
  },
})