import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Pressable,
  Switch
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { DateTimePickerModalProps } from "@/type";
import { COLORS, FONT, SPACING, RADIUS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";

export default function DateTimePickerModal({
  isVisible,
  onClose,
  showTimePicker,
  setShowTimePicker,
  currentDate,
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  onDateChange,
}: DateTimePickerModalProps) {
  const [activePicker, setActivePicker] = useState<"from" | "to">("from");

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle={Platform.OS === 'ios' ? "formSheet" : undefined}
    >
      <View style={[styles.containerWithoutTimePicker, showTimePicker && styles.container]}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Date & Time</Text>
          <TouchableOpacity style={styles.doneButton} onPress={onClose}>
             <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>

        {/* DATE PICKER (CALENDAR) */}
        <View style={styles.datePickerContainer}>
            <DateTimePicker
                value={currentDate}
                mode="date"
                themeVariant="light"
                display={Platform.OS === 'ios' ? "inline" : "default"}
                onChange={(event, selectedDate) => selectedDate && onDateChange(selectedDate)}
            />
        </View>
        <View style = {styles.switchContainer}>
          <Text style={styles.switchText}>Choose Time</Text>
        <Switch
            value={showTimePicker}
            onValueChange={setShowTimePicker}
        />
        </View>
        {/* TIME PICKERS */}
        {showTimePicker && (
          <>
        <View style={styles.timeSelectionContainer}>
            <TouchableOpacity 
                style={[styles.timeCard, activePicker === 'from' && styles.timeCardActive]}
                onPress={() => setActivePicker('from')}
            >
                <Text style={[styles.timeCardLabel, activePicker === 'from' && styles.timeCardLabelActive]}>From</Text>
                <Text style={[styles.timeCardValue, activePicker === 'from' && styles.timeCardValueActive]}>
                    {startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}
                </Text>
            </TouchableOpacity>

            <Ionicons name="arrow-forward" size={24} color={COLORS.border} />

            <TouchableOpacity 
                style={[styles.timeCard, activePicker === 'to' && styles.timeCardActive]}
                onPress={() => setActivePicker('to')}
            >
                <Text style={[styles.timeCardLabel, activePicker === 'to' && styles.timeCardLabelActive]}>To</Text>
                <Text style={[styles.timeCardValue, activePicker === 'to' && styles.timeCardValueActive]}>
                    {endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}
                </Text>
            </TouchableOpacity>
        </View>
        <View style={styles.timePickerContainer}>
            <DateTimePicker
                value={activePicker === 'from' ? startTime : endTime}
                mode="time"
                display="spinner"
                themeVariant="light"
                onChange={(event, selectedTime) => {
                  if (selectedTime) {
                    if (activePicker === 'from') {
                      onStartTimeChange(selectedTime);
                      
                      // If the new start time is after the current end time, 
                      // update end time to be start time + 1 minute
                      if (selectedTime >= endTime) {
                        const newEndTime = new Date(selectedTime);
                        newEndTime.setMinutes(newEndTime.getMinutes() + 1);
                        onEndTimeChange(newEndTime);
                      }
                    } else {
                      // For 'to' picker
                      if (selectedTime <= startTime) {
                        // If selected end time is before or equal to start time,
                        // set it to start time + 1 minute
                        const newEndTime = new Date(startTime);
                        newEndTime.setMinutes(newEndTime.getMinutes() + 1);
                        onEndTimeChange(newEndTime);
                      } else {
                        // If selected end time is valid (after start time), use it
                        onEndTimeChange(selectedTime);
                      }
                    }
                  }
                }}
            />  
        </View>
        </> 
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  containerWithoutTimePicker: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
    marginTop: 'auto',
  },
  container: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
    marginTop: 'auto',
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: FONT.size.xl,
    fontWeight: "700",
    color: COLORS.text,
  },
  doneButton: {
      backgroundColor: COLORS.accent,
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.sm,
      borderRadius: RADIUS.md,
  },
  doneButtonText: {
      color: COLORS.white,
      fontWeight: '600',
      fontSize: FONT.size.md,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.sm,
    alignItems: 'center',
    marginVertical: SPACING.sm,
  },
  switchText: {
    fontSize: FONT.size.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  datePickerContainer: {
      marginVertical: SPACING.md,
      backgroundColor: COLORS.background,
      borderRadius: RADIUS.lg,
      padding: SPACING.sm
  },
  timeSelectionContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      marginVertical: SPACING.sm,
      gap: SPACING.sm,
  },
  timeCard: {
      flex: 1,
      padding: SPACING.sm,
      borderRadius: RADIUS.md,
      borderWidth: 2,
      borderColor: COLORS.border,
      alignItems: 'center',
      backgroundColor: COLORS.background,
  },
  timeCardActive: {
      borderColor: COLORS.accent,
      backgroundColor: COLORS.accent,
  },
  timeCardLabel: {
      fontSize: FONT.size.md,
      color: COLORS.textMuted,
      fontWeight: '600',
  },
  timeCardLabelActive: {
      color: COLORS.white,
  },
  timeCardValue: {
      fontSize: FONT.size.lg,
      fontWeight: '700',
      color: COLORS.text,
      marginTop: SPACING.xs,
  },
  timeCardValueActive: {
      color: COLORS.white,
  },
  timePickerContainer: {
    minHeight: 150,
    justifyContent: 'center'
  }
})