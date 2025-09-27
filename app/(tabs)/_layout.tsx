import { useSegments } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { View, StyleSheet } from 'react-native';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {

  const segments = useSegments();
  const currentSegment = segments[segments.length - 1];
  const hideTabBar = currentSegment === 'ChatScreen' || currentSegment === 'myListings';
  return (
      <NativeTabs
        // screenOptions={{
        //   tabBarActiveTintColor: COLORS.accent,
        //   headerShown: false,
        //   tabBarStyle: {
        //     backgroundColor: 'transparent',
        //     borderTopWidth: 0,
        //     position: 'absolute',
        //     bottom: 0,
        //     left: 0,
        //     right: 0,
        //     height: 80,
        //     elevation: 0,
        //     display: hideTabBar ? 'none' : 'flex',
        //   },
        //   tabBarBackground: () => (
        //     <View style={styles.tabBarBackground} />
        //   ),
        //   // Optimize performance
        //   animation: 'fade', // Disable animations for better performance
        //   freezeOnBlur: false, // Keep screens active when not focused
        //   lazy: true, // Only render tabs when they become active
        //   tabBarHideOnKeyboard: true,
        // }}
        backgroundColor={COLORS.background}
        
      >
      <NativeTabs.Trigger
        name="index"
        // options={{
        //   title: 'Home',
        //   tabBarIcon: ({ color, focused }) => (
        //     <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
        //   ),
        // }}
       >
        <Label selectedStyle={{ color: COLORS.accent }}>Home</Label>
        <Icon sf="house.fill" drawable="custom_android_drawable" selectedColor={COLORS.accent}/>
       </NativeTabs.Trigger>
      <NativeTabs.Trigger
        name="addItem"
        // options={{
        //   title: 'Add',
        //   tabBarIcon: ({ color, focused }) => (
        //     <Ionicons name={focused ? 'add-circle' : 'add-circle-outline'} size={28} color={color} />
        //   ),
        // }}
      >
        <Label selectedStyle={{ color: COLORS.accent }}>Add</Label>
        <Icon sf="plus.circle.fill" drawable="custom_android_drawable" selectedColor={COLORS.accent}/>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger
        name="(chats)"
        // options={{
        //   title: 'Chat',
        //   tabBarIcon: ({ color, focused }) => (
        //     <Ionicons name={focused ? 'chatbubble' : 'chatbubble-outline'} size={24} color={color} />
        //   ),
        // }}
      >
        <Label selectedStyle={{ color: COLORS.accent }}>Chat</Label>
        <Icon sf="message.fill" drawable="custom_android_drawable" selectedColor={COLORS.accent}/>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger
        name="(profile)"
        // options={{
        //   title: 'Profile',
        //   tabBarIcon: ({ color, focused }) => (
        //     <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
        //   ),
        // }}
      >
        <Label selectedStyle={{ color: COLORS.accent }}>Profile</Label>
        <Icon sf="person.fill" drawable="custom_android_drawable" selectedColor={COLORS.accent}/>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  tabBarBackground: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
});