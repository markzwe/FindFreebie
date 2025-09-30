import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  Image, 
   
  ActivityIndicator, 
  Platform,
  ImageStyle,
  ViewStyle,
  TextStyle
} from 'react-native';
import { router } from 'expo-router';
import { login } from '../../lib/appwrite';
import { COLORS } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import TermsModal from '@/components/termsInfo/TermsModal';
import PrivacyModal from '@/components/termsInfo/PrivacyModal';

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const session = await login();
      // TODO: Replace 'true' with 'session' after appwrite upgrade
      if (session) {
        router.replace('/(auth)/permissions');
      } else {
        Alert.alert('Error', 'Failed to sign in. Please try again.');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/images/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Findfreebies</Text>
          <Text style={styles.subtitle}>Discover freebies in your area</Text>
        </View>
        
        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={styles.googleButton} 
            onPress={handleGoogleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <View style={styles.buttonContent}>
                <Ionicons name="logo-google" size={20} color="#FFFFFF" style={styles.googleIcon} />
                <Text style={styles.buttonText}>Continue with Google</Text>
              </View>
            )}
          </TouchableOpacity>
          
          <Text style={styles.termsText}>
            By continuing, you agree to our <Text style={styles.termsLink} onPress={() => setShowTermsModal(true)}>Terms of Service</Text> and <Text style={styles.termsLink} onPress={() => setShowPrivacyModal(true)}>Privacy Policy</Text>
          </Text>
        </View>
      </View>
      <TermsModal visible={showTermsModal} onClose={() => setShowTermsModal(false)} />
      <PrivacyModal visible={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 150,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 24,
  },
  bottomContainer: {
    marginBottom: 40,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accent,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  termsText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
  termsLink: {
    color: COLORS.accent,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  privacyLink: {
    color: COLORS.accent,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  
});