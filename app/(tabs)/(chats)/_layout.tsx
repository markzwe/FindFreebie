import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ChatLayout() {

    return (
        <Stack
        screenOptions={{ headerShown: false }}
        >
            <SafeAreaView>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen 
              name="ChatScreen" 
              options={{ 
                headerShown: false, 
                presentation: 'fullScreenModal',
                animation: "ios_from_right",
              }}  
            />
            </SafeAreaView>
        </Stack>
    )
}