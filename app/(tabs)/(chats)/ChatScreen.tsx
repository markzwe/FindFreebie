import { View, Text, TouchableOpacity, StyleSheet, TextInput, SafeAreaView, Platform, KeyboardAvoidingView, RefreshControl, FlatList } from 'react-native'
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { COLORS, SPACING } from '@/constants/theme'
import { useLocalSearchParams, useRouter } from 'expo-router';
import { addMessage, appwriteConfig, chatroomChannel, client, getMessagesForChatroom, getUserFromDatabase, tablesDB } from '@/lib/appwrite';
import { useAppwrite } from '@/lib/useAppwrite';
import { Message } from '@/type';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
const MessageBubble = React.memo(({ 
  message, 
  isCurrentUser 
}: { 
  message: Message, 
  isCurrentUser: boolean 
}) => (
  <View
    style={[
      styles.messageBubble,
      isCurrentUser ? styles.sentMessage : styles.receivedMessage
    ]}
  >
    <Text style={isCurrentUser ? styles.sentMessageText : styles.messageText}>{message.content}</Text>
    <Text style={isCurrentUser ? styles.messageTimeSent : styles.messageTime}>
      {new Date(message.$createdAt).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}
    </Text>
  </View>
));

export default function ChatScreen() {
  const params = useLocalSearchParams();
  console.log(params);
  const chatroomId = typeof params.chatroomId === 'string' ? params.chatroomId : undefined;
  const itemImage = params.itemImage;

  
  const router = useRouter();
  const { data: user } = useAppwrite({ 
    fn: (params: { userId?: string }) => getUserFromDatabase(params.userId),
    params: { userId: undefined }
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageContent, setMessageContent] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [chatInfo, setChatInfo] = useState<{ sellerName: string; buyerName: string; itemTitle: string; otherUserName: string } | null>(null);

  const fetchChatInfo = async () => {
    if (!chatroomId || !user?.$id) return;
    
    try {
      // Get chatroom details
      const chatroom = await tablesDB.getRow({
        databaseId: appwriteConfig.databaseId!,
        tableId: appwriteConfig.chatRoomTableId!,
        rowId: chatroomId
      });
      
      if (chatroom) {
        // Get item details
        const item = await tablesDB.getRow({
          databaseId: appwriteConfig.databaseId!,
          tableId: appwriteConfig.itemsTableId!,
          rowId: chatroom.item
        });
        
        // Get both seller and buyer details
        const [seller, buyer] = await Promise.all([
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
        const isSeller = user.$id === chatroom.seller;
        const otherUser = isSeller ? buyer : seller;
        
        setChatInfo({
          sellerName: seller?.name || 'Seller',
          buyerName: buyer?.name || 'Buyer',
          itemTitle: item?.title || 'Item',
          otherUserName: otherUser?.name || (isSeller ? 'Buyer' : 'Seller')
        });
      }
    } catch (error) {
      console.error('Error fetching chat info:', error);
    }
  };

  const getMessages = async () => {
    if (!chatroomId) return;
    
    try {
      const response = await getMessagesForChatroom(chatroomId);
      if (response?.rows) {
        setMessages(response.rows);
        // Fetch chat info after messages are loaded
        await fetchChatInfo();
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await getMessages();
    setRefreshing(false);
  }, [getMessages]);

  React.useEffect(() => {
    getMessages();
  }, [getMessages]);

   // Subscribe to messages
   React.useEffect(() => {
    // listen for updates on the chat room document
    const channel = `databases.${appwriteConfig.databaseId}.tables.${appwriteConfig.chatRoomTableId}.rows.${chatroomId}`;

    const unsubscribe = client.subscribe(channel, () => {
      console.log("chat room updated");
      getMessages();
    });

    return () => {
      unsubscribe();
    };
  }, [chatroomId]);

  const handleSendMessage = useCallback(async () => {
    if (!messageContent.trim() || !user?.$id || !chatroomId) return;
    
    const trimmedContent = messageContent.trim();
    
    // Optimistic update
    const optimisticMessage: Message = {
      $id: `temp-${Date.now()}`,
      content: trimmedContent,
      senderId: user.$id,
      chatroomId,
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      $databaseId: '',
      $permissions: [],
      $sequence: 0,
      $tableId: 'messages',
      $collectionId: ''
    };

    // Add to end of messages array (assuming backend returns newest last)
    setMessages(prev => [...prev, optimisticMessage]);
    setMessageContent('');

    try {
      await addMessage({
        content: trimmedContent,
        senderId: user.$id,
        chatroomId,
      });
      
      // Refresh to get real message
      await getMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.filter(msg => !msg.$id.startsWith('temp-')));
      setMessageContent(trimmedContent);
    }
  }, [messageContent, user?.$id, chatroomId, getMessages]);

  const renderMessage = useMemo(() => ({ item }: { item: Message }) => (
    <MessageBubble 
      message={item} 
      isCurrentUser={item.senderId === user?.$id} 
    />
  ), [user?.$id]);

  const keyExtractor = (item: Message) => item.$id;

  if (!chatroomId) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text>No chatroom selected</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => router.replace('/(tabs)/(chats)')} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={COLORS.text} />
            </TouchableOpacity>
            
            {itemImage && (
              <Image 
                source={{ uri: Array.isArray(itemImage) ? itemImage[0] : itemImage || '' }} 
                style={styles.avatar} 
              />
            )}
            
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle} numberOfLines={1}>
                {chatInfo?.otherUserName || 'Chat'}
              </Text>
              <Text style={styles.headerSubtitle} numberOfLines={1}>
                {chatInfo?.itemTitle || ''}
              </Text>
            </View>
          </View>
        </View>

        <FlatList
          data={messages}
          inverted
          keyExtractor={keyExtractor}
          renderItem={renderMessage}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={COLORS.accent}
            />
          }
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          removeClippedSubviews={true}
          initialNumToRender={20}
          maxToRenderPerBatch={10}
          windowSize={10}
        />

        <View style={styles.inputContainer}>
          {/* <TouchableOpacity style={styles.mediaButton}>
            <Ionicons name="image" size={24} color={COLORS.accent} />
          </TouchableOpacity> */}
          
          <TextInput
            placeholder="Type your message"
            style={styles.input}
            placeholderTextColor={COLORS.textMuted}
            value={messageContent}
            onChangeText={setMessageContent}
            onSubmitEditing={handleSendMessage}
            multiline
            maxLength={1000}
          />
          
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Ionicons name="send" size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    gap: SPACING.md,
  },
  backButton: {
    padding: SPACING.xs,
    marginLeft: -SPACING.xs,
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: SPACING.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
    flex: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
  },
  messagesContainer: {
    flexGrow: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  messageBubble: {
    maxWidth: '60%',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 12,
    marginVertical: 2,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.accent,
    borderBottomRightRadius: 4,
  },
  sentMessageText: {
    color: COLORS.background,
  },

  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 11,
    color: COLORS.textMuted,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  messageTimeSent: {
    fontSize: 11,
    color: COLORS.surface,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SPACING.sm,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.surface,
    fontSize: 16,
    color: COLORS.text,
    textAlignVertical: 'top',
  },
  mediaButton: {
    padding: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
  }
});