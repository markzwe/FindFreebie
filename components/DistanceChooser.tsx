import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import Slider from '@react-native-community/slider';
import { COLORS, SPACING, RADIUS, FONT } from '@/constants/theme';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

interface DistanceChooserProps {
  selectedDistance: number;
  onDistanceChange: (distance: number) => void;
  visible: boolean;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

export const DistanceChooser: React.FC<DistanceChooserProps> = ({
  selectedDistance,
  onDistanceChange,
  visible,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sliderValue, setSliderValue] = useState(selectedDistance);
  const [isSliding, setIsSliding] = useState(false);

  const distances = [
    { label: 'All', value: 0 },
    { label: '1 mi', value: 1 },
    { label: '5 mi', value: 5 },
    { label: '10 mi', value: 10 },
    { label: '25 mi', value: 25 },
    { label: '50 mi', value: 50 },
    { label: '100 mi', value: 100 },
    { label: '200 mi', value: 200 },
  ];

  // Update local state when selectedDistance prop changes
  useEffect(() => {
    setSliderValue(selectedDistance);
  }, [selectedDistance]);

  // Find the closest step in our distances array
  const getClosestStep = (value: number) => {
    return distances.reduce((prev, curr) => 
      Math.abs(curr.value - value) < Math.abs(prev.value - value) ? curr : prev
    ).value;
  };

  const handleValueChange = (value: number) => {
    setSliderValue(value);
  };

  const handleSlidingComplete = (value: number) => {
    // This is now handled directly in the Slider's onSlidingComplete
  };

  const handleApply = () => {
    onDistanceChange(sliderValue);
    setIsModalVisible(false);
  };

  const currentDistance = sliderValue === 0 ? 'All' : 
    distances.find(d => d.value === sliderValue)?.label || 
    `${Math.round(sliderValue)} mi`;

  if (!visible) return null;

  return (
    <>
      <TouchableOpacity 
        style={styles.distanceButton}
        onPress={() => setIsModalVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.distanceText}>{currentDistance}</Text>
        <Ionicons name="chevron-down" size={18} color={COLORS.accent} />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Set Distance</Text>
              <TouchableOpacity 
                onPress={() => setIsModalVisible(false)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.sliderContainer}>
              <Text style={styles.distanceLabel}>
                {currentDistance} radius
              </Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={200}
                minimumTrackTintColor={COLORS.accent}
                maximumTrackTintColor={COLORS.border}
                thumbTintColor={COLORS.accent}
                step={1}

                value={sliderValue}
                onValueChange={handleValueChange}
                onSlidingStart={() => setIsSliding(true)}
                onSlidingComplete={(value) => {
                  // Snap to 0 for 'All' when close to the left edge
                  const step = value < 0.5 ? 0 : getClosestStep(value);
                  setSliderValue(step);
                  onDistanceChange(step);
                  setIsSliding(false);
                }}
              />
            </View>
            
            <View style={styles.distanceMarkers}>
            
                  <Text style={styles.markerText}>All</Text>
             
            </View>

            <TouchableOpacity 
              style={styles.applyButton}
              onPress={handleApply}
              activeOpacity={0.8}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  // Button Styles
  distanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 70,
    justifyContent: 'center',
  },
  distanceText: {
    color: COLORS.accent,
    fontSize: 13,
    fontWeight: '600',
    marginRight: 4,
    fontFamily: FONT.family.medium,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    margin: SPACING.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: FONT.size.sm,
    fontFamily: FONT.family.bold,
    color: COLORS.text,
  },
  closeButton: {
    padding: SPACING.md,
  },

  // Slider Styles
  sliderContainer: {
    width: '100%',
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.sm,
  },
  distanceLabel: {
    fontSize: FONT.size.md,
    fontFamily: FONT.family.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  slider: {
    width: '100%',
    height: 1,
  },
  distanceMarkers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: SPACING.md,
    
  },
  markerText: {
    color: COLORS.textMuted,
    fontSize: FONT.size.sm,
  },

  // Apply Button
  applyButton: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  applyButtonText: {
    color: COLORS.white,
    fontSize: FONT.size.md,
    fontFamily: FONT.family.bold,
  },
});