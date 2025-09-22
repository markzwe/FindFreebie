import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Modal } from 'react-native'
import { Item, CoordinatesType, User, AddressType } from '@/type'
import { Image } from 'expo-image'
import { SPACING, COLORS, RADIUS, FONT } from '@/constants/theme';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import MapView from './MapView'
import { SafeAreaView } from 'react-native-safe-area-context'
import { account, addItems, createChatRoom, getUserFromDatabase } from '@/lib/appwrite'
import { router } from 'expo-router'

interface ItemViewDetailModalProps {
  item: Item;
  isVisible: boolean;
  onClose: () => void;
}

export default function ItemViewDetailModal({ item, isVisible, onClose }: ItemViewDetailModalProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userLocationCoordinates, setUserLocationCoordinates] = useState<CoordinatesType | null>(null);
  const [isSellerUser, setIsSellerUser] = useState<boolean>();

  const [seller, setSeller] = useState<User>({} as User);
  
  let address = JSON.parse(item.address);
  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUserFromDatabase();
      setUser(userData as unknown as User);
      setUserLocationCoordinates({
        coordinates: {
          latitude: userData?.latitude,
          longitude: userData?.longitude
        }
      });
    };
    fetchUser();
  }, []);

  
  const hasValidLocation = !!userLocationCoordinates;
  
  useEffect(() => {
    fetchSeller();
  }, []);
  const fetchSeller = async () => {
    const sellerData = await getUserFromDatabase(item.user);
    setSeller(sellerData as unknown as User);
    setIsSellerUser(user?.$id === item.user);
    console.log('Seller:', isSellerUser);
  };
  
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const formatTime = (time: Date | string | undefined) => {
    if (!time) return null;
    const timeObj = typeof time === 'string' ? new Date(time) : time;
    return timeObj.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleCreateChatroom = async () => {
    if (!user) console.log('User not found');
    else {
      const chatroomId = await createChatRoom({itemId: item.$id, sellerId: item.user, buyerId: user.$id});
      onClose();
      router.replace({
        pathname: '/(tabs)/(chats)/ChatScreen',
        params: { chatroomId: chatroomId }
      });
    }
  };


  return (

    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
      presentationStyle="formSheet"
      style={[styles.container, {paddingTop: 20}]}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft} />
          <Text style={styles.headerTitle}>Details</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={COLORS.accent} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Image */}
          <Image 
            source={item.image} 
            style={styles.itemImage}
            contentFit="contain" 
          />
          
          {/* Title and Category */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.categoryBadge}>
              <Ionicons 
                name={item.category === 'Food' ? 'restaurant-outline' : 'cube-outline'} 
                size={16} 
                color={COLORS.accent} 
              />
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
          </View>

          {/* Description */}
          {item.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          )}

          {/* Date and Time */}
          <View style={styles.section}>
            <View style={styles.dateTimeContainer}>
              <View style={styles.dateTimeItem}>
                <Ionicons name="calendar-outline" size={20} color={COLORS.accent} />
                <View style={styles.dateTimeInfo}>
                  <Text style={styles.dateTimeLabel}>Date</Text>
                  <Text style={styles.dateTimeValue}>
                    {formatDate(item.eventDate)}
                  </Text>
                </View>
              </View>
              
              {(item.startTime || item.endTime) && (
                <View style={styles.dateTimeItem}>
                  <Ionicons name="time-outline" size={20} color={COLORS.accent} />
                  <View style={styles.dateTimeInfo}>
                    <Text style={styles.dateTimeLabel}>Time</Text>
                    <Text style={styles.dateTimeValue}>
                      {formatTime(item.startTime) || 'Start time not specified'}
                      {item.endTime && formatTime(item.endTime) && 
                        ` - ${formatTime(item.endTime)}`
                      }
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
          {/* Seller */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Posted By</Text>
              <View style={styles.sellerContainer}>
                <View style={styles.sellerInfo}>
                  <Image
                    source={{ uri: seller.avatar }}
                    style={styles.sellerImage}
                  />
                  <Text style={styles.sellerName}>{seller.name}</Text>
                </View>
                {!isSellerUser && (
                  <TouchableOpacity style={styles.actionButton} onPress={handleCreateChatroom}>
                    <Ionicons name="chatbubble-outline" size={20} color={COLORS.white} />
                    <Text style={styles.actionButtonText}>Send Message</Text>
                  </TouchableOpacity>
                )}
              </View>
        
          </View>

          {/* Location */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            {hasValidLocation ? (
              
              <View style={styles.locationContainer}>
                <MapView location={item.location as unknown as CoordinatesType} viewOnly={true} />
                <View style={styles.locationInfo}>
                  <Ionicons name="location-outline" size={20} color={COLORS.accent} />
                  <Text style={styles.locationText}>
                    {address?.name ? `${address.name}, ${address.postalCode || ''}` : 'Location not available'}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.noLocationContainer}>
                <Ionicons name="location-outline" size={32} color={COLORS.textMuted} />
                <Text style={styles.noLocationText}>Location not available</Text>
              </View>
            )}
          </View>

        </ScrollView>
      </SafeAreaView>
    </Modal>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,

  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  headerLeft: {
    width: 40,
  },
  headerTitle: {
    fontSize: FONT.size.lg,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  itemImage: {
    width: '100%',
    height: 250,
    backgroundColor: COLORS.surface,
  },
  titleSection: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: FONT.size.xl,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
    marginRight: SPACING.md,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryText: {
    fontSize: FONT.size.sm,
    color: COLORS.accent,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.lg + 10,
  },
  sectionTitle: {
    fontSize: FONT.size.md,
    fontStyle: 'italic',
    fontWeight: '600',
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: FONT.size.md,
    color: COLORS.text,
    lineHeight: 24,
  },
  dateTimeContainer: {
    gap: SPACING.md,
  },
  dateTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dateTimeInfo: {
    marginLeft: SPACING.sm,
    flex: 1,
  },
  dateTimeLabel: {
    fontSize: FONT.size.xs,
    color: COLORS.textMuted,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dateTimeValue: {
    fontSize: FONT.size.md,
    color: COLORS.text,
    fontWeight: '600',
    marginTop: 2,
  },
  sellerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  sellerImage: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
  },
  sellerName: {
    fontSize: FONT.size.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  locationContainer: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
  },
  locationText: {
    fontSize: FONT.size.sm,
    color: COLORS.text,
    marginLeft: SPACING.sm,
    fontFamily: 'monospace',
  },
  noLocationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.xl,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  noLocationText: {
    fontSize: FONT.size.md,
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
  },
  actionsSection: {
    position: 'absolute',
    bottom: 35,
 
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    gap: SPACING.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: COLORS.accent,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    gap: SPACING.sm,
  },
  actionButtonText: {
    fontSize: FONT.size.md,
    color: COLORS.white,
    fontWeight: '600',
  },
  actionButtonSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.accent,
    gap: SPACING.sm,
  },
  actionButtonTextSecondary: {
    fontSize: FONT.size.md,
    color: COLORS.accent,
    fontWeight: '600',
  },
  sellerText: {
    fontSize: FONT.size.md,
    color: COLORS.text,
  },
});