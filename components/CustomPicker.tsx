import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, TouchableWithoutFeedback } from 'react-native';
import { COLORS, FONT, SPACING, RADIUS } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface PickerItem {
  id: string;
  name: string;
}

interface CustomPickerProps {
  items: PickerItem[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

const CustomPicker: React.FC<CustomPickerProps> = ({
  items,
  selectedValue,
  onValueChange,
  placeholder = 'Select an option',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const [selectedItem, setSelectedItem] = useState<PickerItem | null>(
    items.find(item => item.id === selectedValue) || null
  );

  const togglePicker = () => {
    const toValue = isOpen ? 0 : 1;
    
    // Close the dropdown immediately when toggling off
    if (isOpen) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => setIsOpen(false));
    } else {
      setIsOpen(true);
      Animated.spring(animation, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 20,
      }).start();
    }
  };

  const handleSelect = (item: PickerItem) => {
    setSelectedItem(item);
    onValueChange(item.id);
    togglePicker();
  };

  const rotate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const maxHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, items.length * 44],
  });
  
  const opacity = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });
  
  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 0],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.pickerButton} 
        onPress={togglePicker}
        activeOpacity={0.8}
      >
        <Text style={styles.selectedText} numberOfLines={1}>
          {selectedItem?.name || placeholder}
        </Text>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Ionicons name="chevron-down" size={20} color={COLORS.text} />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View 
        style={[
          styles.dropdown, 
          { 
            maxHeight: 200, // Set a reasonable max height
            opacity,
            transform: [{ translateY }],
          }
        ]}
      >
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.option,
              selectedItem?.id === item.id && styles.selectedOption,
            ]}
            onPress={() => handleSelect(item)}
          >
            <Text 
              style={[
                styles.optionText,
                selectedItem?.id === item.id && styles.selectedOptionText,
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    zIndex: 1000,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    height: '100%',
    width: '100%',
  },
  selectedText: {
    flex: 1,
    fontSize: FONT.size.sm,
    color: COLORS.text,
    fontFamily: FONT.family.regular,
    marginRight: SPACING.xs,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: COLORS.border,
    borderBottomLeftRadius: RADIUS.md,
    borderBottomRightRadius: RADIUS.md,
    overflow: 'hidden',
    zIndex: 1001,
    elevation: 5,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  optionText: {
    fontSize: FONT.size.sm,
    color: COLORS.text,
    fontFamily: FONT.family.regular,
  },
  selectedOption: {
    backgroundColor: COLORS.accent + '20',
  },
  selectedOptionText: {
    color: COLORS.accent,
    fontFamily: FONT.family.medium,
  },
});

export default CustomPicker;
