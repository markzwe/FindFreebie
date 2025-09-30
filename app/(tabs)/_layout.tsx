import { COLORS } from '@/constants/theme';
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/auth.store';
import { useEffect } from 'react';

export default function TabLayout() {
  // const segments = useSegments();
  // const currentSegment = segments[segments.length - 1];
  // const hideTabBar = currentSegment === 'ChatScreen' || currentSegment === 'myListings';
 const {isLoading, fetchAuthenticatedUser, isAuthenticated} = useAuthStore()
 
   useEffect(() => {
     fetchAuthenticatedUser();
     if (isLoading) {
       return;
     }
     if (!isAuthenticated) {
       router.replace('/(auth)/sign-in');
     }  
   }, []);
 
  return (
      <NativeTabs

      disableTransparentOnScrollEdge={true}
      blurEffect="light"
      indicatorColor={COLORS.accent}
      backgroundColor={COLORS.white}
      >
        
      <NativeTabs.Trigger
        name="index"
       >
        <Label selectedStyle={{ color: COLORS.accent }}>Home</Label>
        <Icon sf="house.fill" drawable="custom_android_drawable" selectedColor={COLORS.accent} />
       </NativeTabs.Trigger>
      <NativeTabs.Trigger
        name="addItem"
      >
        <Label selectedStyle={{ color: COLORS.accent }}>Add</Label>
        <Icon sf="plus.circle.fill" drawable="custom_android_drawable" selectedColor={COLORS.accent}/>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger
        name="(chats)"

      >
        <Label selectedStyle={{ color: COLORS.accent }}>Chat</Label>
        <Icon sf="message.fill" drawable="custom_android_drawable" selectedColor={COLORS.accent}/>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger
        name="(profile)"

      >
        <Label selectedStyle={{ color: COLORS.accent }}>Profile</Label>
        <Icon sf="person.fill" drawable="custom_android_drawable" selectedColor={COLORS.accent}/>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

