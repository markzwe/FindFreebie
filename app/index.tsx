import { useEffect } from 'react';
import { Redirect, router } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { getCurrentUser } from '../lib/appwrite';
import { useAuthStore } from '../store/auth.store';

export default function Index() {

  const {isLoading, fetchAuthenticatedUser, isAuthenticated} = useAuthStore()

  useEffect(() => {
    fetchAuthenticatedUser();
    console.log("isAuthenticated", isAuthenticated)
  }, []);


  if(isLoading){
    return (
      <View style={styles.container}>
        <Text>Loading..</Text>
      </View>
    );
  }
  else if(isAuthenticated){
    return (
      <Redirect href="/(tabs)" />     
    );
  }
  else{
    return (
      <Redirect href="/(auth)/sign-in" />     
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
