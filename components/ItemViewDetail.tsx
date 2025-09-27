import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Types
import { AddressType, CoordinatesType, Item, User } from '@/type';

import MapView from './MapView';

// Services
import { createChatRoom, deleteItem, getUserFromDatabase } from '@/lib/appwrite';

// Constants
import { COLORS, FONT, RADIUS, SPACING } from '@/constants/theme';
import { formatDate, formatTime } from '@/utils/dateUtils';


// Utils

interface ItemViewDetailModalProps {
  item: Item;
  // ...
  isVisible: boolean;
  onClose: () => void;
}

interface ModalState {
  user: User | null;
  seller: User | null;
  userLocationCoordinates: CoordinatesType | null;
  isLoading: boolean;
  error: string | null;
}

const INITIAL_STATE: ModalState = {
  user: null,
  seller: null,
  userLocationCoordinates: null,
  isLoading: false,
  error: null,
};

const ItemViewDetailModal: React.FC<ItemViewDetailModalProps> = ({ 
  item, 
  isVisible, 
  onClose 
}) => {
  const [state, setState] = useState<ModalState>(INITIAL_STATE);

  // Memoized values
  const parsedAddress = useMemo(() => {
    try {
      return JSON.parse(item.address) as AddressType;
    } catch (error) {
      console.error('Failed to parse address:', error);
      return null;
    }
  }, [item.address]);

  const isSellerUser = useMemo(() => {
    return state.user?.$id === item.user;
  }, [state.user?.$id, item.user]);


  const locationDisplayText = useMemo(() => {
    const fullAddress = item.address;
    if (!parsedAddress) {
      return 'Location not available';
    }
    else if (!item.showLocationDetails) {
      return JSON.parse(fullAddress).postalCode;
    }
    return `${JSON.parse(fullAddress).name}${JSON.parse(fullAddress).postalCode ? `, ${JSON.parse(fullAddress).postalCode}` : ''}`;
  }, [item.showLocationDetails, item.address]); 

  // Fetch current user data
  const fetchUserData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const userData = await getUserFromDatabase();
      
      if (!userData) {
        throw new Error('Failed to fetch user data');
      }

      setState(prev => ({
        ...prev,
        user: userData as unknown as User,
        userLocationCoordinates: userData.latitude && userData.longitude ? {
          coordinates: {
            latitude: userData.latitude,
            longitude: userData.longitude
          }
        } : null,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error fetching user data:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to load user data',
        isLoading: false,
      }));
    }
  }, []);

  // Fetch seller data
  const fetchSellerData = useCallback(async () => {
    if (!item.user) return;

    try {
      const sellerData = await getUserFromDatabase(item.user);
      
      if (!sellerData) {
        throw new Error('Failed to fetch seller data');
      }

      setState(prev => ({
        ...prev,
        seller: sellerData as unknown as User,
      }));
    } catch (error) {
      console.error('Error fetching seller data:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to load seller information',
      }));
    }
  }, [item.user]);

  // Handle chat room creation
  const handleCreateChatroom = useCallback(async () => {
    if (!state.user) {
      Alert.alert('Error', 'Please log in to send messages');
      return;
    }

    if (isSellerUser) {
      Alert.alert('Info', 'You cannot message yourself');
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true }));

      const chatroomId = await createChatRoom({
        itemId: item.$id,
        sellerId: item.user,
        buyerId: state.user.$id,
      });

      if (!chatroomId) {
        throw new Error('Failed to create chat room');
      }

      onClose();
      
      router.replace({
        pathname: '/(tabs)/(chats)/ChatScreen',
        params: { chatroomId },
      });
    } catch (error) {
      console.error('Error creating chat room:', error);
      Alert.alert('Error', 'Failed to create chat. Please try again.');
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.user, isSellerUser, item.$id, item.user, onClose]);

  // Effects
  useEffect(() => {
    if (isVisible) {
      fetchUserData();
      fetchSellerData();
    }
  }, [isVisible, fetchUserData, fetchSellerData]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isVisible) {
      setState(INITIAL_STATE);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const handleClose = () => {
    onClose();
  };

  const handleDelete = () => {
    Alert.alert('Delete', 'Are you sure you want to delete this item?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => {
          deleteItem(item.$id);
          onClose();
        },
      },
    ]);
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
      presentationStyle="formSheet"
    >
      <SafeAreaView style={styles.container}>
        <Header onClose={onClose} />
        
        <ScrollView 
          style={styles.content}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 80 }]}
        >          
          <ItemImage source={item.image} />
          
          <TitleSection 
            title={item.title}
            category={item.category}
          />
          
          {item.description && (
          <DescriptionSection description={item.description} />
          )}
          
          <DateTimeSection 
            eventDate={item.eventDate}
            startTime={item.startTime}
            endTime={item.endTime}
          />
          
          {state.seller && (
            <SellerSection 
              seller={state.seller}
              isSellerUser={isSellerUser}
              onMessagePress={handleCreateChatroom}
              isLoading={state.isLoading}
            />
          )}

          <LocationSection
            location={item.location as unknown as CoordinatesType}
            locationText={locationDisplayText} 
          />
        </ScrollView>

        {isSellerUser && (
          <View style={styles.editDeleteContainer}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <Ionicons name="trash" size={24} color={COLORS.white} />
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

// Sub-components for better organization
const Header: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <View style={styles.header}>
    <View style={styles.headerLeft} />
    <Text style={styles.headerTitle}>Details</Text>
    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
      <Ionicons name="close" size={24} color={COLORS.accent} />
    </TouchableOpacity>
  </View>
);

const ItemImage: React.FC<{ source: string }> = ({ source }) => (
  <Image 
    source={source} 
    style={styles.itemImage}
    contentFit="contain" 
  />
);

const TitleSection: React.FC<{ title: string; category: string }> = ({ 
  title, 
  category 
}) => (
  <View style={styles.titleSection}>
    <Text style={styles.title}>{title}</Text>
    <View style={styles.categoryBadge}>
      <Ionicons 
        name={category === 'Food' ? 'restaurant-outline' : 'cube-outline'} 
        size={16} 
        color={COLORS.accent} 
      />
      <Text style={styles.categoryText}>{category}</Text>
    </View>
  </View>
);

const DescriptionSection: React.FC<{ description?: string }> = ({ description }) => (
  description ? (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  ) : null
);

const DateTimeSection: React.FC<{
  eventDate: Date | string;
  startTime?: Date | string;
  endTime?: Date | string;
}> = ({ eventDate, startTime, endTime }) => (
  <View style={styles.section}>
    <View style={styles.dateTimeContainer}>
      <View style={styles.dateTimeItem}>
        <Ionicons name="calendar-outline" size={20} color={COLORS.accent} />
        <View style={styles.dateTimeInfo}>
          <Text style={styles.dateTimeLabel}>Date</Text>
          <Text style={styles.dateTimeValue}>
            {formatDate(eventDate)}
          </Text>
        </View>
      </View>
      
      {(startTime || endTime) && (
        <View style={styles.dateTimeItem}>
          <Ionicons name="time-outline" size={20} color={COLORS.accent} />
          <View style={styles.dateTimeInfo}>
            <Text style={styles.dateTimeLabel}>Time</Text>
            <Text style={styles.dateTimeValue}>
              {formatTime(startTime) || 'Start time not specified'}
              {endTime && formatTime(endTime) && 
                ` - ${formatTime(endTime)}`
              }
            </Text>
          </View>
        </View>
      )}
    </View>
  </View>
);

const SellerSection: React.FC<{
  seller: User;
  isSellerUser: boolean;
  onMessagePress: () => void;
  isLoading: boolean;
}> = ({ seller, isSellerUser, onMessagePress, isLoading }) => (
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
        <TouchableOpacity 
          style={[styles.actionButton, isLoading && styles.actionButtonDisabled]} 
          onPress={onMessagePress}
          disabled={isLoading}
        >
          <Ionicons name="chatbubble-outline" size={20} color={COLORS.white} />
          <Text style={styles.actionButtonText}>
            {isLoading ? 'Loading...' : 'Send Message'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
);

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface LocationSectionProps {
  location: [number, number] | { coordinates: Coordinates } | Coordinates | null | undefined;
  locationText: string;
}

const LocationSection: React.FC<LocationSectionProps> = ({ location, locationText }) => {
  // Convert item.location to the format expected by MapView
  const mapLocation = useMemo(() => {
    if (!location) return null;
    
    try {
      // If location is an array [longitude, latitude]
      if (Array.isArray(location)) {
        return {
          coordinates: {
            latitude: location[1],
            longitude: location[0]
          }
        };
      }
      
      // If location is already in the correct format with coordinates
      if ('coordinates' in location) {
        return location;
      }
      
      // If location is an object with latitude and longitude
      if ('latitude' in location && 'longitude' in location) {
        return {
          coordinates: {
            latitude: location.latitude,
            longitude: location.longitude
          }
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error parsing location:', error);
      return null;
    }
  }, [location]);
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Location</Text>
      {mapLocation ? (
        <View style={styles.locationContainer}>
          <MapView location={mapLocation} viewOnly={true} />
          <View style={styles.locationInfo}>
            <View style={styles.locationTextContainer}>
              <Ionicons name="location-outline" size={20} color={COLORS.accent} />
              <Text style={styles.locationText}>
                {locationText || 'Location not specified'}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.noLocationContainer}>
          <Ionicons name="location-outline" size={32} color={COLORS.textMuted} />
          <Text style={styles.noLocationText}>Location not available</Text>
        </View>
      )}
    </View>
);
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
    paddingBottom: SPACING.xl,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  locationTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: SPACING.md,
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
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: COLORS.accent,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    gap: SPACING.sm,
  },
  actionButtonDisabled: {
    backgroundColor: COLORS.textMuted,
    opacity: 0.7,
  },
  actionButtonText: {
    fontSize: FONT.size.md,
    color: COLORS.white,
    fontWeight: '600',
  },


  editDeleteContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xl,
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.danger,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    gap: SPACING.sm,
    alignSelf: 'center',
  },
  deleteButtonText: {
    fontSize: FONT.size.md,
    color: COLORS.white,
    fontWeight: '600',
  },
});

export default ItemViewDetailModal;