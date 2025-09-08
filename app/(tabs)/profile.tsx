import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
} from "react-native";

import { getCurrentUser, getUserFromDatabase, logout } from "@/lib/appwrite";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS, SHADOW, SIZES } from "@/constants/theme";
import { Image } from "expo-image";
import { useAuthStore } from "@/store/auth.store";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const STATS = [
  { id: '1', label: 'Items Found', value: '24', icon: 'gift-outline' },
  { id: '2', label: 'Items Shared', value: '12', icon: 'share-social-outline' },
  { id: '3', label: 'Favorites', value: '8', icon: 'heart-outline' },
];

const ACTIONS = [
  { id: '1', title: 'My Listings', icon: 'list-outline', color: COLORS.accent },
  { id: '2', title: 'Saved Items', icon: 'bookmark-outline', color: COLORS.accent },
  { id: '3', title: 'Messages', icon: 'chatbubble-ellipses-outline', color: '#FF9F43' },
];

const SETTINGS = [
  { id: '1', title: 'Account Settings', icon: 'settings-outline' },
  { id: '2', title: 'Notification Settings', icon: 'notifications-outline' },
  { id: '3', title: 'Help & Support', icon: 'help-circle-outline' },
  { id: '4', title: 'About', icon: 'information-circle-outline' },
];

const Profile = () => {
  const { user } = useAuthStore();

  const [userDB, setUserDB] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserFromDatabase();
        setUserDB(userData);
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
      Alert.alert('Logged Out', 'You have been successfully logged out.');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const renderStats = () => (
    <View style={styles.statsContainer}>
      {STATS.map((stat) => (
        <View key={stat.id} style={styles.statItem}>
     
          <Text style={styles.statValue}>{stat.value}</Text>
          <Text style={styles.statLabel}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );

  const renderActions = () => (
    <View style={styles.actionsContainer}>
      {ACTIONS.map((action) => (
        <TouchableOpacity key={action.id} style={styles.actionButton}>
          <View style={[styles.actionIcon, { backgroundColor: `${action.color}15` }]}>
            <Ionicons name={action.icon as any} size={24} color={action.color} />
          </View>
          <Text style={styles.actionText}>{action.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderSettings = () => (
    <View style={styles.settingsContainer}>
      {SETTINGS.map((setting) => (
        <TouchableOpacity key={setting.id} style={styles.settingItem}>
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
    </View>
  );

  
  return (
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
              <Text style={styles.userName}>{user?.name || 'Guest User'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'guest@example.com'}</Text>
            </View>
          </View>

        <View style={styles.content}>
          {renderStats()}
          {renderActions()}
          {renderSettings()}
        </View>
      </ScrollView>
    </View>
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
    paddingBottom: 40, // Add some bottom padding for better scrolling
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
  },
  logoutText: {
    color: '#EF4444',
  },
});

export default Profile;
