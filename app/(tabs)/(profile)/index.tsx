import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { ACTIONS, SETTINGS } from "@/constants";
import { COLORS, SHADOW } from "@/constants/theme";
import { getUserFromDatabase, logout } from "@/lib/appwrite";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useEffect, useState, version } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, Stack } from "expo-router";
import { User } from "@/type";
import Constants from 'expo-constants';
import TermsModal from "@/components/termsInfo/TermsModal";
import PrivacyModal from "@/components/termsInfo/PrivacyModal";
const Profile = () => {
  const [userDB, setUserDB] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserFromDatabase();
        setUserDB(userData as unknown as User);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/(auth)/sign-in');
      Alert.alert('Logged Out', 'You have been successfully logged out.');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const renderActions = () => (
    <View style={[styles.actionsContainer, { justifyContent: 'center' }]}>
      {ACTIONS.map((action) => (
        <TouchableOpacity 
          key={action.id} 
          style={[
            styles.actionButton,
            { 
              width: 120,
              alignItems: 'center',
              padding: 16,
              borderRadius: 12,
              backgroundColor: '#fff',
              ...SHADOW.medium
            }
          ]}
          activeOpacity={0.8}
          onPress={() => {
            router.push({
              pathname: '/(tabs)/(profile)/myListings',
              params: { userID: userDB?.$id} 
            });
          }}
        >
          <View 
            style={[
              styles.actionIcon, 
              { 
                backgroundColor: `${action.color}15`,
                width: 50,
                height: 50,
                borderRadius: 25,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 8
              }
            ]}
          >
            <Ionicons 
              name={action.icon as any} 
              size={24} 
              color={action.color} 
            />
          </View>
          <Text style={styles.actionText}>
            {action.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderSettings = () => (
    <View style={styles.settingsContainer}>
      {SETTINGS.map((setting) => (
        <TouchableOpacity key={setting.id} style={styles.settingItem} onPress={() => {
          if (setting.id === '3') {
            setTermsModalVisible(true);
          } else if (setting.id === '4') {
            setPrivacyModalVisible(true);
          }
        }}>
          <View style={styles.settingLeft}>
            <Ionicons name={setting.icon as any} size={24} color={COLORS.text} />
            <Text style={styles.settingText}>{setting.title}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>
      ))}
      <TouchableOpacity 
        style={[styles.settingItem, styles.logoutButton]} 
        onPress={handleLogout}
      >
        <View style={styles.settingLeft}>
          <MaterialCommunityIcons name="logout" size={24} color="#EF4444" />
          <Text style={[styles.settingText, styles.logoutText]}>Logout</Text>
        </View>
      </TouchableOpacity>
      {/* <TouchableOpacity 
        style={[styles.settingItem, styles.logoutButton]} 
        onPress={handleLogout}
      >
        <View style={styles.settingLeft}>
          <MaterialCommunityIcons name="delete" size={24} color="#EF4444" />
          <Text style={[styles.settingText, styles.logoutText]}>Delete Account</Text>
        </View>
      </TouchableOpacity> */}
    </View>
  );

  
  return (
    <>
    <View style={styles.outerContainer}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContainer} 
        scrollToOverflowEnabled={true}
        overScrollMode="always"
        style={styles.scrollView}
        
      >
          <View style={[styles.overlay, { paddingTop: useSafeAreaInsets().top}]}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: userDB?.avatar || undefined}}
                  style={styles.avatar}
                />
                <TouchableOpacity style={styles.editIcon}>
                  <Ionicons name="camera" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
              <Text style={styles.userName}>{userDB?.name || 'Guest User'}</Text>
              <Text style={styles.userEmail}>{userDB?.email || 'guest@example.com'}</Text>
            </View>
          </View>

        <View style={styles.content}>
          {renderActions()}
          {renderSettings()}
        </View>
        <View style={styles.bottomContainer}>
  <Image 
    source={require('../../../assets/images/icon.png')}
    style={styles.appIcon}
    contentFit="cover"
  />
  <Text style={styles.appName}>Findfreebies</Text>
  <Text style={styles.appVersion}>Version {Constants.expoConfig?.version}</Text>
  <Text style={styles.madeWithText}>Made with ❤️ in Dayton</Text>
</View>
      </ScrollView>
      <TermsModal visible={termsModalVisible} onClose={() => setTermsModalVisible(false)} />
      <PrivacyModal visible={privacyModalVisible} onClose={() => setPrivacyModalVisible(false)} />
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: COLORS.accent,
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    paddingBottom: 40, // Reduced bottom padding
  },
  header: {
    height: 280,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  overlay: {
    flex: 1,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  editIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: COLORS.accent,
    borderRadius: 15,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    fontFamily: 'Rubik-Bold',
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 26,
  },
  content: {
    flex: 1,
    padding: 20,
    marginTop: -40,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    ...SHADOW.medium,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
    fontFamily: 'Rubik-Bold',
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  actionsContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    width: '31%',
    
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: COLORS.text,
    textAlign: 'center',
    fontFamily: 'Rubik-Medium',
  },
  settingsContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    marginBottom: 20, // Add margin to ensure space below
    minHeight: 200, // Ensure minimum height
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 16,
    fontFamily: 'Rubik-Medium',
  },
  logoutButton: {
    borderBottomWidth: 0,
    marginTop: 10, // Add some space above the delete button
  },
  logoutText: {
    color: '#EF4444',
  },
  bottomContainer: {
    padding: 20,
    alignItems: 'center',

    paddingTop: 10,
    paddingBottom: 50,
  },
  appIcon: {
    borderRadius: 12,
    width: 45,
    height: 45,
    marginBottom: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
        shadowColor: '#000',
      },
    }),
    backgroundColor: '#fff',
    padding: 5,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  madeWithText: {
    marginBottom: 16,
    fontSize: 14,
    color: COLORS.textMuted,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  socialIcon: {
    marginHorizontal: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appVersion: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 8,
  },

});


export default Profile;
