import { View, Text, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { logout } from '@/lib/appwrite';
import { router } from 'expo-router';
import { COLORS } from '@/constants/theme';
import { useAppwrite } from '@/lib/useAppwrite';

export default function Account() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { refetch } = useAppwrite({
    fn: async () => {
      await logout();
      return { success: true };
    },
    skip: true,
  });

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const success = await logout();
      if (success) {
        router.push('/(auth)/sign-in'); // redirect after logout
      } else {
        Alert.alert("Logout Failed", "There was an error logging out. Please try again.");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      Alert.alert("Logout Failed", "Unexpected error occurred.");
    } finally {
      setIsLoggingOut(false);
    }
  };
  

  const confirmLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: handleLogout, style: 'destructive' }
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24 }}>Account</Text>
        
        <TouchableOpacity 
          onPress={confirmLogout}
          style={{
            backgroundColor: COLORS.danger,
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 200
          }}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: 'white', fontWeight: '600' }}>Logout</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}