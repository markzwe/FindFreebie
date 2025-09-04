import { COLORS, SPACING, RADIUS, FONT } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  TextInput,
  StyleSheet,
} from "react-native";

import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePickerModal from "@/components/DateTimePickerModal";
import DescriptionModal from "@/components/DescriptionModal";
import MapView from "@/components/MapView";
import * as Location from 'expo-location';
import { LocationType } from "@/type";

export default function AddItem() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [caption, setCaption] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  const [category, setCategory] = useState<"Food" | "Item" | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isDescriptionModalVisible, setIsDescriptionModalVisible] = useState(false);
  const [location, setLocation] = useState<LocationType | null>(null);
   useEffect(() => {
        async function getCurrentLocation() {
          let location = await Location.getCurrentPositionAsync({});
          setLocation({
            coordinates: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
          });
        }
    
        getCurrentLocation();
      }, []);



  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) setSelectedImage(result.assets[0].uri);
  };

  const handleShare = async () => {
    setIsSharing(true);
    // TODO: upload to backend (image + metadata)
    setTimeout(() => {
      setIsSharing(false);
      router.replace("/"); // Go home after posting
    }, 1500);
  };

  const isFormValid = selectedImage && title.trim() && category;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
   
    >
      <SafeAreaView style={styles.contentContainer}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => router.back()} 
            disabled={isSharing}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={isSharing ? COLORS.darkGray : COLORS.text}
            />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Add Freebie</Text>
            <Text style={styles.headerSubtitle}>Share something free</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.shareButton, 
              !isFormValid && styles.shareButtonDisabled,
              isSharing && styles.shareButtonLoading
            ]}
            disabled={isSharing || !isFormValid}
            onPress={handleShare}
          >
            {isSharing ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text style={[
                styles.shareText,
                !isFormValid && styles.shareTextDisabled
              ]}>
                Share
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* IMAGE SECTION */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.imageContainer}
              onPress={pickImage}
              disabled={isSharing}
              activeOpacity={0.8}
            >
              {selectedImage ? (
                <>
                  <Image
                    source={selectedImage}
                    style={styles.previewImage}
                    contentFit="cover"
                    transition={200}
                  />
                  <View style={styles.imageOverlay}>
                    <Ionicons name="camera" size={20} color={COLORS.white} />
                    <Text style={styles.overlayText}>Change</Text>
                  </View>
                </>
              ) : (
                <View style={styles.emptyImage}>
                  <View style={styles.imageIconContainer}>
                    <Ionicons name="camera-outline" size={32} color={COLORS.accent} />
                  </View>
                  <Text style={styles.emptyImageTitle}>Add Photo</Text>
                  <Text style={styles.emptyImageSubtitle}>
                    Choose a clear image of your freebie
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* FORM FIELDS */}
          <View style={styles.section}>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>
                Title <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, title.trim() && styles.inputFilled]}
                placeholder="What are you sharing?"
                placeholderTextColor={COLORS.textMuted}
                value={title}
                onChangeText={setTitle}
                editable={!isSharing}
                returnKeyType="next"
              />
            </View>

            {/* DESCRIPTION */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Description</Text>
              <TouchableOpacity 
                style={[styles.input]}
                onPress={() => setIsDescriptionModalVisible(true)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text 
                    style={[styles.description, !description && { color: COLORS.textMuted }]} 
                    numberOfLines={1}
                  >
                    {description || 'Add a description...'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* CATEGORY */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>
                Category <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.categoryRow}>
                {["Food", "Item"].map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.categoryButton,
                      category === c && styles.categoryButtonActive,
                    ]}
                    onPress={() => setCategory(c as "Food" | "Item")}
                    disabled={isSharing}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={c === "Food" ? "restaurant-outline" : "cube-outline"}
                      size={20}
                      color={category === c ? COLORS.white : COLORS.accent}
                    />
                    <Text
                      style={[
                        styles.categoryText,
                        category === c && styles.categoryTextActive,
                      ]}
                    >
                      {c}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* From */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>From</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.7}
              >
                <View style={styles.dateSection}>
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={COLORS.accent}
                  />
                  <View style={styles.dateInfo}>
                    <Text style={styles.dateLabel}>Date</Text>
                    <Text style={styles.dateValue}>
                      {date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.dateDivider} />
                
                <View style={styles.dateSection}>
                  <Ionicons
                    name="time-outline"
                    size={20}
                    color={COLORS.accent}
                  />
                  <View style={styles.dateInfo}>
                    <Text style={styles.dateLabel}>Time</Text>
                    <Text style={styles.dateValue}>
                      {date.toLocaleTimeString([], { 
                        hour: "2-digit", 
                        minute: "2-digit" 
                      })}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity> 
          
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>To</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.7}
              >
                <View style={styles.dateSection}>
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={COLORS.accent}
                  />
                  <View style={styles.dateInfo}>
                    <Text style={styles.dateLabel}>Date</Text>
                    <Text style={styles.dateValue}>
                      {date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.dateDivider} />
                
                <View style={styles.dateSection}>
                  <Ionicons
                    name="time-outline"
                    size={20}
                    color={COLORS.accent}
                  />
                  <View style={styles.dateInfo}>
                    <Text style={styles.dateLabel}>Time</Text>
                    <Text style={styles.dateValue}>
                      {date.toLocaleTimeString([], { 
                        hour: "2-digit", 
                        minute: "2-digit" 
                      })}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity> 
          
            </View>
            {/* MAP */}
            <View style={styles.fieldContainer}> 
              <Text style={styles.fieldLabel}>Location</Text> 
              <MapView location={location as LocationType} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      {/* MODALS */}
      <DescriptionModal
                isVisible={isDescriptionModalVisible}
                onClose={() => setIsDescriptionModalVisible(false)}
                description={description}
                setDescription={setDescription}
                isSharing={isSharing}
              />
                  <DateTimePickerModal
                  isVisible={showDatePicker}
                  onClose={() => setShowDatePicker(false)}
                  date={date}
                  onDateChange={(date) => setDate(date)}
                />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
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
  shareButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.accent,
    minWidth: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  shareButtonDisabled: {
    backgroundColor: COLORS.lightGray,
  },
  shareButtonLoading: {
    backgroundColor: COLORS.accent,
  },
  shareText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: FONT.size.sm,
  },
  shareTextDisabled: {
    color: COLORS.darkGray,
  },

  /* SECTIONS */
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },

  /* IMAGE */
  imageContainer: {
    position: "relative",
  },
  previewImage: {
    width: "100%",
    height: 280,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.lightGray,
  },
  imageOverlay: {
    position: "absolute",
    top: SPACING.md,
    right: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  overlayText: {
    color: COLORS.white,
    fontSize: FONT.size.xs,
    marginLeft: 4,
    fontWeight: "500",
  },
  emptyImage: {
    height: 280,
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.lg,
  },
  imageIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  emptyImageTitle: {
    fontSize: FONT.size.lg,
    color: COLORS.text,
    fontWeight: "600",
    marginBottom: SPACING.xs,
  },
  emptyImageSubtitle: {
    fontSize: FONT.size.sm,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },

  /* FORM FIELDS */
  fieldContainer: {
    marginBottom: SPACING.md,
  },
  fieldLabel: {
    fontSize: FONT.size.md,
    color: COLORS.text,
    fontWeight: "600",
    marginVertical: SPACING.md,
    letterSpacing: -0.2,
  },
  required: {
    color: COLORS.accent,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: FONT.size.md,
    color: COLORS.text,
    borderWidth: 2,
    borderColor: COLORS.border,
    lineHeight: 20,
    minHeight: 56,
    justifyContent: 'center',
  },
  inputFilled: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.surface,
  },
  textArea: {
    minHeight: 10,
    textAlignVertical: "top",
    paddingTop: SPACING.md,
  },
  characterCount: {
    fontSize: FONT.size.xs,
    color: COLORS.textMuted,
    position: 'absolute',
    right: SPACING.md,
    bottom: SPACING.sm,
  },
  description: {
    fontSize: FONT.size.md,
    color: COLORS.text,
    fontWeight: '500',
    flex: 1,
  },

  /* CATEGORY */
  categoryRow: {
    flexDirection: "row",
    gap: SPACING.md,
  },
  categoryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    gap: SPACING.sm,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  categoryText: {
    fontSize: FONT.size.md,
    color: COLORS.text,
    fontWeight: "600",
  },
  categoryTextActive: {
    color: COLORS.white,
  },

  /* DATE */
  dateButton: {
    marginTop: SPACING.lg,
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
  },
  dateSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  dateDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.md,
  },
  dateInfo: {
    flex: 1,
  },
  dateLabel: {
    fontSize: FONT.size.xs,
    color: COLORS.textMuted,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dateValue: {
    fontSize: FONT.size.md,
    color: COLORS.text,
    fontWeight: "600",
    marginTop: 2,
  },

  /* MAP */
  mapContainer: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
  },

});