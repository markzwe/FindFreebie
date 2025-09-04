import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { DateTimePickerModalProps } from "@/type";
import { COLORS, FONT, SPACING, RADIUS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";

export default function DateTimePickerModal({
  isVisible,
  onClose,
  date,
  onDateChange,
}: DateTimePickerModalProps) {
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}
      transparent = {true}
    >
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Select Date & Time</Text>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.headerButton, { justifyContent: "flex-end" }]}
          >
            <Text style={[styles.headerText, { color: COLORS.accent }]}>
              Done
            </Text>
          </TouchableOpacity>          
        </View>

        {/* PICKER */}
        <View style={styles.pickerWrapper}>
          <DateTimePicker
            themeVariant="light"
            value={date}
            mode="datetime"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              if (selectedDate) {
                onDateChange(selectedDate);
              }
            }}
            style={styles.picker}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.border,
    height: "40%",
    marginTop: 'auto',
    paddingBottom: SPACING.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  headerButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.xs,
  },
  headerText: {
    fontSize: FONT.size.md,
    marginLeft: 4,
    color: COLORS.textMuted,
  },
  title: {
    flex: 1,
    fontSize: FONT.size.lg,
    fontWeight: "600",
    color: COLORS.text,

  },
  pickerWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  picker: {
    alignSelf: "center",
  },
});
