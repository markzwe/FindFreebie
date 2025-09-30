import { COLORS, FONT, SPACING } from '@/constants/theme';
import { appwriteConfig, getChatRooms, getUserFromDatabase, tablesDB } from '@/lib/appwrite';
import { Chatroom } from '@/type';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Chat() {
  const router = useRouter();
  const [chatRooms, setChatRooms] = useState<Array<Chatroom & { 
    sellerName?: string; 
    buyerName?: string;
    otherUserName?: string;
    itemTitle?: string; 
    itemImage?: string | null 
  }>>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userDB, setUserDB] = useState<any>(null);
  
  //fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserFromDatabase();
        setUserDB(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } 
    };
    
    fetchUserData();
  }, []);
  
  const fetchChatInfo = async (chatroom: Chatroom) => {
    try {
      // Get item details
      const [item, seller, buyer] = await Promise.all([
        tablesDB.getRow({
          databaseId: appwriteConfig.databaseId!,
          tableId: appwriteConfig.itemsTableId!,
          rowId: chatroom.item
        }),
        tablesDB.getRow({
          databaseId: appwriteConfig.databaseId!,
          tableId: appwriteConfig.userTableId!,
          rowId: chatroom.seller
        }),
        tablesDB.getRow({
          databaseId: appwriteConfig.databaseId!,
          tableId: appwriteConfig.userTableId!,
          rowId: chatroom.buyer
        })
      ]);
      
      // Determine if current user is the seller or buyer
      const isSeller = userDB?.$id === chatroom.seller;
      const otherUser = isSeller ? buyer : seller;
      
      return {
        ...chatroom,
        sellerName: seller?.name || 'Seller',
        buyerName: buyer?.name || 'Buyer',
        otherUserName: otherUser?.name || (isSeller ? 'Buyer' : 'Seller'),
        itemTitle: item?.title || 'Item',
        itemImage: item?.image || null
      };
    } catch (error) {
      console.error('Error fetching chat info:', error);
      return {
        ...chatroom,
        sellerName: 'Seller',
        itemTitle: 'Item',
        itemImage: null
      };
    }
  };

  const handleDeleteChatroom = async (chatroomId: string) => {
    try {
      // Delete from your database
      await tablesDB.deleteRow({
        databaseId: appwriteConfig.databaseId!,
        tableId: appwriteConfig.chatRoomTableId!, // Make sure this exists in your config
        rowId: chatroomId
      });
      
      // Update local state
      setChatRooms(prev => prev.filter(room => room.$id !== chatroomId));
    } catch (error) {
      console.error('Error deleting chatroom:', error);
    }
  };

  const RightAction = (chatroomId: string) => (prog: SharedValue<number>, drag: SharedValue<number>) => {
    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: drag.value - 65  }],
      };
    });
    
    return (
      <Reanimated.View style={[styles.rightAction, styleAnimation]}>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => handleDeleteChatroom(chatroomId)}
        >
          <Ionicons name="trash-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </Reanimated.View>
    );
  };

  const fetchChatRooms = async () => {
    try {
      const response = await getChatRooms();
      // Fetch additional info for each chat room
      const chatRoomsWithInfo = await Promise.all(
        response.rows.map((room: Chatroom) => fetchChatInfo(room))
      );
      setChatRooms(chatRoomsWithInfo);
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      setChatRooms([]);
    }
  };

  useEffect(() => {
    if (userDB) {
      fetchChatRooms();
    }
  }, [userDB]);

  const handleChatroomPress = (chatroom: Chatroom & { itemImage?: string | null }, index: number) => {
    router.push({
      pathname: "/(tabs)/(chats)/ChatScreen",
      params: {
        chatroomId: chatroom.$id,
        userData: userDB,
        itemImage: chatroom.itemImage,
      },
    });
  }

  return (
    <SafeAreaView style={styles.container}> 
      <View style={[styles.header]}>
        <TouchableOpacity onPress={() => {router.push('/(tabs)/(profile)')}}>
          <Image
            source={{ uri: userDB?.avatar || undefined}}
            style={styles.avatar}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={styles.headerRight}/>
      </View>
      <FlatList
        contentContainerStyle={styles.overlay}
        stickyHeaderIndices={[0]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchChatRooms} />}
        data={chatRooms}
        renderItem={({ item, index }) => (
          <GestureHandlerRootView>
            <ReanimatedSwipeable
              friction={2}
              enableTrackpadTwoFingerGesture
              leftThreshold={40}
              renderLeftActions={RightAction(item.$id)}
              rightThreshold={0}
              renderRightActions={undefined}
            >
              <TouchableOpacity 
                style={styles.chatroomItem} 
                onPress={() => {handleChatroomPress(item, index)}} 
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: item.itemImage || undefined }}
                  style={styles.chatroomAvatar}
                />
                <View style={styles.chatroomInfo}>
                  <View style={styles.chatroomTextContainer}>
                    <Text style={styles.chatroomTitle} numberOfLines={1}>
                      {item.otherUserName || 'User'}
                    </Text>
                    <Text style={styles.chatroomSubtitle} numberOfLines={1}>
                      {item.itemTitle}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color="black" />
              </TouchableOpacity>
            </ReanimatedSwipeable>
          </GestureHandlerRootView>
        )}
        keyExtractor={(item) => item.$id}
        contentInsetAdjustmentBehavior='automatic'
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Uh oh! No messages found</Text>
          </View>
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,  
    overflow: 'hidden',
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerRight: {
    width: 50, 
    height: 50, 
    opacity: 0, 
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: COLORS.accent,
  },
  overlay: {
    backgroundColor: COLORS.background, 
  },
  headerTitle: {
    fontSize: FONT.size.lg,
    fontWeight: "700",
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  chatroomItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  chatroomAvatar: {
    width: 50,
    height: 50,
    borderRadius: 60,
    marginRight: SPACING.md,
  },
  chatroomInfo: {
    flex: 1,
  },
  chatroomTextContainer: {
    flex: 1,
  },
  chatroomTitle: {
    fontSize: FONT.size.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  chatroomSubtitle: {
    fontSize: FONT.size.sm,
    color: COLORS.textMuted,
    letterSpacing: -0.2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  emptyText: {
    fontSize: FONT.size.md,
    fontWeight: '600',
    color: COLORS.textMuted,
    letterSpacing: -0.2,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
  },
  rightAction: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: SPACING.lg,
  },
  deleteButton: {
    backgroundColor: COLORS.danger,
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: '100%',
    borderRadius: 8,
  },
});