import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { login } from '../../lib/appwrite';

export default function SignIn() {
  const handleGoogleSignIn = async () => {
    try {
      const session = await login();
      if (session) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', 'Failed to sign in');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FindFreeFood</Text>
      <Text style={styles.subtitle}>Discover free food in your area</Text>
      
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
        <Text style={styles.buttonText}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  googleButton: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    minWidth: 200,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});