import { SPACING } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';

export default function SearchBar() {
  const params = useLocalSearchParams<{query?: string}>();
  const [query, setQuery] = React.useState(params.query);

  const handleSearch = (text: string) => {
    setQuery(text); // Only update local state, don't trigger search
  }

  const handleSubmit = () => {
    if (typeof query === 'string' && query.trim()) {
      router.setParams({ query: query.trim() });
    } else if (!query || !query.trim()) {
      router.setParams({ query: undefined });
    }
  };

  const handleSearchButton = () => {
    handleSubmit();
  };

  return (
    <View style={styles.searchbar}>
      <TextInput
        style={styles.input}
        placeholder = "Search"
        value={query}
        onChangeText={handleSearch}
        onSubmitEditing={handleSubmit}
        returnKeyType='search'
        placeholderTextColor="grey"
      />
      <TouchableOpacity
        style = {styles.searchButton}
        onPress={handleSearchButton}
      >
        <Ionicons
          name='search-outline'
          color={'black'}
          size={23}
        />
      </TouchableOpacity>
    </View>
  )
}
const styles = StyleSheet.create({
  searchbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 50,
    paddingHorizontal: 3,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },

  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
  },

  searchButton: {
    paddingHorizontal: SPACING.md,
    borderRadius: 12,
    marginRight: 2,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
})