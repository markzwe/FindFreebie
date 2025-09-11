import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getUserFromDatabase } from '@/lib/appwrite'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS, FONT, SIZES, SPACING } from '@/constants/theme'
import { Image } from 'expo-image'
import { Link, router } from 'expo-router'
import { dummyChatrooms } from '@/lib/data'
import { Chatroom } from '@/type'
import { Ionicons } from '@expo/vector-icons'

export default function Chat() {
 const [userDB, setUserDB] = useState<any>(null);
   const [loading, setLoading] = useState(true);
 
   useEffect(() => {
     const fetchUserData = async () => {
       try {
         const userData = await getUserFromDatabase();
         setUserDB(userData);
       } catch (error) {
         console.error("Error fetching user data:", error);
       } finally {
         setLoading(false);
       }
     };
 
     fetchUserData();
   }, []);
 
   const handleChatroomPress = (chatroom: Chatroom, index: number) => {
    router.push({
      pathname: "/(tabs)/(chats)/ChatScreen",
      params: {
        chatroomId: chatroom.$id,
        userData: userDB,
       },
    });
   }
  return (
    <SafeAreaView style={styles.container}> 
    <FlatList
      contentContainerStyle={styles.overlay}
      stickyHeaderIndices={[0]}
      ListHeaderComponent={
        <View style={[styles.header]}>

        <Link href="/profile">
        <Image
          source={{ uri: userDB?.avatar || undefined}}
          style={styles.avatar}
        />
        </Link>
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={styles.headerRight}/>
      </View>
      }
      data={dummyChatrooms}
      renderItem={({ item, index }) => (
        <TouchableOpacity style={styles.chatroomItem} onPress={() => {handleChatroomPress(item, index)}} activeOpacity={0.8}>
          <Image
            source={{ uri: 'https://mdbcdn.b-cdn.net/img/new/avatars/2.webp' }}
            style={styles.chatroomAvatar}
          />
          <View style={styles.chatroomInfo}>
            <Text style={styles.chatroomTitle} numberOfLines={2}>{'Mark • Pizza Give Away'}</Text>
          </View>
          <View>
            <Ionicons name="chevron-forward" size={24} color="black" />
          </View>
        </TouchableOpacity>
        
        )}
      keyExtractor={(item) => item.$id}
      contentInsetAdjustmentBehavior='automatic'
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
  },
  chatroomAvatar: {
    width: 50,
    height: 50,
    borderRadius: 60,
    marginRight: SPACING.md,
  },
  chatroomInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chatroomTitle: {
    fontSize: FONT.size.md,
    fontWeight: '600',
    color: COLORS.text,
    letterSpacing: -0.2,
    marginBottom: SPACING.sm,
  },
  chatroomDescription: {
    fontSize: FONT.size.sm,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginTop: 2,
  },
  chatroomTime: {
    fontSize: FONT.size.xs,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginTop: 2,
  },
  chatroomUnreadCount: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.danger,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatroomUnreadCountText: {
    fontSize: FONT.size.xs,
    color: COLORS.white,
    fontWeight: '600',
  },


})