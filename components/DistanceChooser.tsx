import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import Slider from '@react-native-community/slider';
import { COLORS, SPACING, RADIUS, FONT } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

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
    { label: '100m', value: 0.1 },
    { label: '200m', value: 0.2 },
    { label: '500m', value: 0.5 },
    { label: '1km', value: 1 },
    { label: '2km', value: 2 },
    { label: '5km', value: 5 },
    { label: '10km', value: 10 },
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
    const step = getClosestStep(value);
    setSliderValue(step);
    onDistanceChange(step);
    setIsSliding(false);
  };

  const handleApply = () => {
    onDistanceChange(sliderValue);
    setIsModalVisible(false);
  };

  const currentDistance = distances.find(d => d.value === sliderValue)?.label || '1km';

  if (!visible) return null;

  return (
    <>
      <TouchableOpacity 
        style={styles.distanceButton}
        onPress={() => setIsModalVisible(true)}
        activeOpacity={0.8}
      >
        <MaterialIcons name="location-on" size={18} color={COLORS.accent} />
        <Text style={styles.distanceText}>{currentDistance}</Text>
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
                minimumValue={0.1}
                maximumValue={10}
                minimumTrackTintColor={COLORS.accent}
                maximumTrackTintColor={COLORS.border}
                thumbTintColor={COLORS.accent}
                step={0.1}
                value={sliderValue}
                onValueChange={handleValueChange}
                onSlidingStart={() => setIsSliding(true)}
                onSlidingComplete={handleSlidingComplete}
              />
              <View style={styles.distanceMarkers}>
                <Text style={styles.markerText}>100m</Text>
                <Text style={styles.markerText}>5km</Text>
                <Text style={styles.markerText}>10km</Text>
              </View>
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
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    height: 40,
    minWidth: 100,
  },
  distanceText: {
    color: COLORS.text,
    fontSize: FONT.size.md,
    fontFamily: FONT.family.medium,
    marginLeft: SPACING.xs,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: FONT.size.lg,
    fontFamily: FONT.family.bold,
    color: COLORS.text,
  },
  closeButton: {
    padding: SPACING.xs,
  },

  // Slider Styles
  sliderContainer: {
    paddingVertical: SPACING.lg,
  },
  distanceLabel: {
    fontSize: FONT.size.xl,
    fontFamily: FONT.family.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  distanceMarkers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
  },
  markerText: {
    color: COLORS.textMuted,
    fontSize: FONT.size.sm,
  },

  // Apply Button
  applyButton: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  applyButtonText: {
    color: COLORS.white,
    fontSize: FONT.size.md,
    fontFamily: FONT.family.bold,
  },
});