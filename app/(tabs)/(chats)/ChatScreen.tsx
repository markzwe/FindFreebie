import { View, Text, TouchableOpacity, StyleSheet, TextInput, SafeAreaView, Platform, FlatList, Keyboard, KeyboardAvoidingView, ScrollView, ListRenderItem } from 'react-native'
import React from 'react'
import { COLORS, SPACING } from '@/constants/theme'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { LegendList } from "@legendapp/list";
import { useLocalSearchParams } from 'expo-router';
import { Message } from '@/type'
import { getUserFromDatabase } from '@/lib/appwrite';

export default function ChatScreen() {

  const {chatId, userData} = useLocalSearchParams();
  
 
  const [messageContent, setMessageContent] = React.useState("");
  const [chatRoom, setChatRoom] = React.useState<Message>();
  const [messages, setMessages] = React.useState<Message[]>();
  const [isLoading, setIsLoading] = React.useState(true);
  return (
    <SafeAreaView style={style.container}>
      <KeyboardAvoidingView 
        style={style.keyboardAvoidingView} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <View style={style.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Image
            source={{ uri: 'https://mdbcdn.b-cdn.net/img/new/avatars/2.webp' }}
            style={style.avatar}
          />
          <Text style={style.headerTitle} numberOfLines={1}>Mark • {'Pizza Give Away'}</Text>
        </View>
        
 
          <View style={style.messagesContent}>
            {/* Your chat messages will go here */}
            <LegendList
            
            data={messages || []}
            renderItem={({ item }: { item: Message }) => {
              const isSender = item.senderId === userData;
              return (
                <View
                  style={{
                    padding: 10,
                    borderRadius: 10,
                    flexDirection: "row",
                    alignItems: "flex-end",
                    gap: 6,
                    maxWidth: "80%",
                    alignSelf: isSender ? "flex-end" : "flex-start",
                  }}
                >
                  {!isSender && (
                    <Image
                      source={{ uri: 'https://mdbcdn.b-cdn.net/img/new/avatars/2.webp'}}
                      style={{ width: 30, height: 30, borderRadius: 15 }}
                    />
                  )}
                  <View
                    style={{
                      backgroundColor: isSender ? "#007AFF" : "#161616",
                      flex: 1,
                      padding: 10,
                      borderRadius: 10,
                    }}
                  >
                    <Text style={{ fontWeight: "500", marginBottom: 4 }}>
                      {/* {item.senderName} */}
                    </Text>
                    <Text>{item.content}</Text>
                    <Text
                      style={{
                        fontSize: 10,
                        textAlign: "right",
                      }}
                    >
                      {new Date(item.$createdAt!).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                </View>
              );
            }}
            keyExtractor={(item) => item?.$id ?? "unknown"}
            contentContainerStyle={{ padding: 10 }}
            recycleItems={true}
            // initialScrollIndex={messages?.length - 1}
            alignItemsAtEnd // Aligns to the end of the screen, so if there's only a few items there will be enough padding at the top to make them appear to be at the bottom.
            maintainScrollAtEnd // prop will check if you are already scrolled to the bottom when data changes, and if so it keeps you scrolled to the bottom.
            maintainScrollAtEndThreshold={0.5} // prop will check if you are already scrolled to the bottom when data changes, and if so it keeps you scrolled to the bottom.
            maintainVisibleContentPosition //Automatically adjust item positions when items are added/removed/resized above the viewport so that there is no shift in the visible content.
            estimatedItemSize={100} // estimated height of the item
            // getEstimatedItemSize={(info) => { // use if items are different known sizes
            //   console.log("info", info);
            // }}
          />
          </View>
        
        <View style={style.inputContainer}>
          <TouchableOpacity style={style.mediaButton}>
            <Ionicons name="image" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <TextInput
            placeholder="Type your message"
            style={style.input}
            placeholderTextColor={COLORS.textMuted}
            returnKeyType="send"
            value={messageContent}
            onChangeText={setMessageContent}
            enablesReturnKeyAutomatically
          />
          <TouchableOpacity style={style.sendButton} onPress={() => {}}>
            <Ionicons name="send" size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messagesContainer: {
    flexGrow: 1,
    paddingBottom: 80, // Space for the input container
  },
  messagesContent: {
    flex: 1,
    padding: SPACING.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.md,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.surface,
    fontSize: 16,
    color: COLORS.text,
    flexShrink: 1,   
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SPACING.sm,
  },
  mediaButton: {
    padding: SPACING.xs,
  },
  sendButton: {
    backgroundColor: COLORS.accent,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
})