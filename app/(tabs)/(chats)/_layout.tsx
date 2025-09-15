import { Stack } from 'expo-router';
import React from 'react';

export default function ChatLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index"
            options={{
                headerShown: false,
                animation: "ios_from_left",
            }} />
            <Stack.Screen 
                name="ChatScreen" 
                options={{ 
                    headerShown: false, 
                    animation: "ios_from_right",
                }}
            />
        </Stack>
    );
}