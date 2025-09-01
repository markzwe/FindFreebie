import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useRef, useEffect } from 'react'
import { Modal } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, SPACING, RADIUS, FONT } from "@/constants/theme"
import { DescriptionModalProps } from '@/type'

export default function DescriptionModal(
    {isVisible, onClose, description, setDescription, isSharing}: DescriptionModalProps
) {
  const textInputRef = useRef<TextInput>(null)
  
  // Auto-focus when modal opens
  useEffect(() => {
    if (isVisible && textInputRef.current) {
      setTimeout(() => {
        textInputRef.current?.focus()
      }, 100)
    }
  }, [isVisible])

  const handleSave = () => {
    onClose()
  }

  const characterCount = description.length
  const isNearLimit = characterCount > 1800
  const hasContent = description.trim().length > 0

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}
      transparent={false}
      presentationStyle="formSheet"
    >
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <SafeAreaView style={styles.container}>
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={onClose}
              disabled={isSharing}
            >
              <Ionicons 
                name="close" 
                size={24} 
                color={isSharing ? COLORS.darkGray : COLORS.text} 
              />
            </TouchableOpacity>
            
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>Add Description</Text>
              <Text style={styles.headerSubtitle}>
                Tell people more about your freebie
              </Text>
            </View>

            <TouchableOpacity 
              style={[
                styles.saveButton,
                hasContent && styles.saveButtonActive
              ]}
              onPress={handleSave}
              disabled={isSharing}
            >
              <Text style={[
                styles.saveText,
                hasContent && styles.saveTextActive
              ]}>
                Done
              </Text>
            </TouchableOpacity>
          </View>

          {/* CONTENT */}
          <View style={styles.content}>
            <View style={styles.inputContainer}>
              <TextInput
                ref={textInputRef}
                style={[
                  styles.input,
                  hasContent && styles.inputFilled
                ]}
                placeholder="Describe your freebie in detail..."
                placeholderTextColor={COLORS.textMuted}
                multiline
                value={description}
                onChangeText={setDescription}
                editable={!isSharing}
                maxLength={2000}
                textAlignVertical="top"
                returnKeyType="default"
                blurOnSubmit={false}
                scrollEnabled={true}
              />
              
              {/* CHARACTER COUNT */}
              <View style={styles.footer}>
                <View style={styles.characterCountContainer}>
                  <Text style={[
                    styles.characterCount,
                    isNearLimit && styles.characterCountWarning
                  ]}>
                    {characterCount}/2000
                  </Text>
                  {isNearLimit && (
                    <Ionicons 
                      name="warning-outline" 
                      size={16} 
                      color={COLORS.warning || COLORS.accent} 
                    />
                  )}
                </View>
                
                {/* HELPFUL TIPS */}
                {!hasContent && (
                  <View style={styles.tipsContainer}>
                    <Text style={styles.tipsTitle}>💡 Tips for a great description:</Text>
                    <Text style={styles.tipText}>• Include condition and quantity</Text>
                    <Text style={styles.tipText}>• Mention pickup details</Text>
                    <Text style={styles.tipText}>• Add any special instructions</Text>
                    <Text style={styles.tipText}>• Be specific about what you're offering</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: FONT.size.lg,
    fontWeight: "700",
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: FONT.size.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  saveButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.lightGray,
    minWidth: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonActive: {
    backgroundColor: COLORS.accent,
  },
  saveText: {
    color: COLORS.darkGray,
    fontWeight: "600",
    fontSize: FONT.size.sm,
  },
  saveTextActive: {
    color: COLORS.white,
  },

  /* CONTENT */
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  inputContainer: {
    flex: 1,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    fontSize: FONT.size.md,
    color: COLORS.text,
    borderWidth: 2,
    borderColor: COLORS.border,
    lineHeight: 24,
    textAlignVertical: "top",
    minHeight: 200,
  },
  inputFilled: {
    borderColor: COLORS.accent,
  },

  /* FOOTER */
  footer: {
    marginTop: SPACING.lg,
  },
  characterCountContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  characterCount: {
    fontSize: FONT.size.sm,
    color: COLORS.textMuted,
    fontWeight: "500",
  },
  characterCountWarning: {
    color: COLORS.warning || COLORS.accent,
    fontWeight: "600",
  },

  /* TIPS */
  tipsContainer: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tipsTitle: {
    fontSize: FONT.size.md,
    color: COLORS.text,
    fontWeight: "600",
    marginBottom: SPACING.sm,
  },
  tipText: {
    fontSize: FONT.size.sm,
    color: COLORS.textMuted,
    lineHeight: 20,
    marginBottom: SPACING.xs,
  },
});