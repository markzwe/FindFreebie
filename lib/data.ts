import { Message, Chatroom } from '@/type';

export const dummyChatrooms: Chatroom[] = [
  {
    $id: 'chatroom1',
    $createdAt: '2025-09-08T10:00:00Z',
    $updatedAt: '2025-09-08T23:10:00Z',
    title: 'Free Pizza in the Break Room!',
    chatroomAvatar: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60',
  },
  {
    $id: 'chatroom2',
    $createdAt: '2025-09-07T14:30:00Z',
    $updatedAt: '2025-09-08T22:45:00Z',
    title: 'Office Snacks',
    chatroomAvatar: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=500&auto=format&fit=crop&q=60',
  },
];

export const dummyMessages: Record<string, Message[]> = {
  chatroom1: [
    {
      $id: 'msg1',
      $createdAt: '2025-09-08T10:05:00Z',
      $updatedAt: '2025-09-08T10:05:00Z',
      content: 'Hey everyone, there are 3 whole pizzas left in the break room!',
      senderId: 'user1',
      senderName: 'Sarah',
      senderAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      chatroomId: 'chatroom1',
      createdAt: '2025-09-08T10:05:00Z',
    },
    {
      $id: 'msg2',
      $createdAt: '2025-09-08T10:07:00Z',
      $updatedAt: '2025-09-08T10:07:00Z',
      content: 'Thanks for the heads up! What kind of pizza is it?',
      senderId: 'user2',
      senderName: 'Mike',
      senderAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      chatroomId: 'chatroom1',
      createdAt: '2025-09-08T10:07:00Z',
    },
    {
      $id: 'msg3',
      $createdAt: '2025-09-08T10:08:00Z',
      $updatedAt: '2025-09-08T10:08:00Z',
      content: 'There\'s one pepperoni, one veggie, and one cheese!',
      senderId: 'user1',
      senderName: 'Sarah',
      senderAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      chatroomId: 'chatroom1',
      createdAt: '2025-09-08T10:08:00Z',
    },
    {
      $id: 'msg4',
      $createdAt: '2025-09-08T23:10:00Z',
      $updatedAt: '2025-09-08T23:10:00Z',
      content: 'Just grabbed the last slice of pepperoni. Thanks!',
      senderId: 'user3',
      senderName: 'Alex',
      senderAvatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      chatroomId: 'chatroom1',
      createdAt: '2025-09-08T23:10:00Z',
    },
  ],
  chatroom2: [
    {
      $id: 'msg5',
      $createdAt: '2025-09-07T14:35:00Z',
      $updatedAt: '2025-09-07T14:35:00Z',
      content: 'Just stocked up the kitchen with some snacks!',
      senderId: 'user4',
      senderName: 'Jamie',
      senderAvatar: 'https://randomuser.me/api/portraits/men/75.jpg',
      chatroomId: 'chatroom2',
      createdAt: '2025-09-07T14:35:00Z',
    },
    {
      $id: 'msg6',
      $createdAt: '2025-09-07T15:10:00Z',
      $updatedAt: '2025-09-07T15:10:00Z',
      content: 'What kind of snacks did you get?',
      senderId: 'user5',
      senderName: 'Taylor',
      senderAvatar: 'https://randomuser.me/api/portraits/women/22.jpg',
      chatroomId: 'chatroom2',
      createdAt: '2025-09-07T15:10:00Z',
    },
    {
      $id: 'msg7',
      $createdAt: '2025-09-08T22:45:00Z',
      $updatedAt: '2025-09-08T22:45:00Z',
      content: 'We have granola bars, fruit cups, and some chips!',
      senderId: 'user4',
      senderName: 'Jamie',
      senderAvatar: 'https://randomuser.me/api/portraits/men/75.jpg',
      chatroomId: 'chatroom2',
      createdAt: '2025-09-08T22:45:00Z',
    },
  ],
};

// Function to get messages for a specific chatroom
export function getMessagesForChatroom(chatroomId: string): Message[] {
  return dummyMessages[chatroomId] || [];
}

// Function to get all chatrooms
export function getAllChatrooms(): Chatroom[] {
  return dummyChatrooms;
}

// Function to add a new message to a chatroom
export function addMessageToChatroom(chatroomId: string, message: Omit<Message, '$id' | '$createdAt' | '$updatedAt' | 'chatroomId'>): Message {
  const newMessage: Message = {
    ...message,
    $id: `msg${Date.now()}`,
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
    chatroomId,
    createdAt: new Date().toISOString(),
  };

  if (!dummyMessages[chatroomId]) {
    dummyMessages[chatroomId] = [];
  }
  
  dummyMessages[chatroomId].push(newMessage);
  
  // Update the chatroom's updatedAt timestamp
  const chatroom = dummyChatrooms.find(c => c.$id === chatroomId);
  if (chatroom) {
    chatroom.$updatedAt = newMessage.$updatedAt;
  }
  
  return newMessage;
}