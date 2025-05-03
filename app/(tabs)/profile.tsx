import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useArtwork } from '@/hooks/useArtwork';
import Colors from '@/constants/Colors';
import Spacing from '@/constants/Spacing';
import Button from '@/components/Button';
import { useRouter } from 'expo-router';
import { User, Settings, LogOut, Heart, Image as ImageIcon, List } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { artworks, lists } = useArtwork();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          onPress: async () => {
            await logout();
            router.replace('/(auth)');
          },
          style: 'destructive',
        },
      ]
    );
  };

  const favoriteCount = artworks.filter((artwork) => artwork.isFavorite).length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              {user?.profileImageUri ? (
                <Image source={{ uri: user.profileImageUri }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <User size={40} color={Colors.primary[600]} />
                </View>
              )}
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name || 'Art Enthusiast'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{artworks.length}</Text>
          <Text style={styles.statLabel}>Artworks</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{lists.length}</Text>
          <Text style={styles.statLabel}>Lists</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{favoriteCount}</Text>
          <Text style={styles.statLabel}>Favorites</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activity</Text>
        <TouchableOpacity style={styles.activityItem}>
          <View style={styles.activityIcon}>
            <Heart size={20} color={Colors.primary[600]} />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>Favorites</Text>
            <Text style={styles.activitySubtitle}>View your favorited artwork</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.activityItem}>
          <View style={styles.activityIcon}>
            <ImageIcon size={20} color={Colors.primary[600]} />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>Recent Additions</Text>
            <Text style={styles.activitySubtitle}>See your latest saved artwork</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.activityItem}>
          <View style={styles.activityIcon}>
            <List size={20} color={Colors.primary[600]} />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>Lists</Text>
            <Text style={styles.activitySubtitle}>Manage your curated collections</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.accountItem}>
          <Text style={styles.accountItemText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.accountItem}>
          <Text style={styles.accountItemText}>Notification Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.accountItem}>
          <Text style={styles.accountItemText}>Privacy Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.accountItem}>
          <Text style={styles.accountItemText}>Help & Support</Text>
        </TouchableOpacity>
      </View>

      <Button
        title="Log Out"
        onPress={handleLogout}
        type="outline"
        icon={<LogOut size={20} color={Colors.gray[700]} style={{ marginRight: Spacing.sm }} />}
        style={styles.logoutButton}
        textStyle={styles.logoutButtonText}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  contentContainer: {
    paddingBottom: Spacing.xxl,
  },
  header: {
    backgroundColor: Colors.background,
    paddingTop: 60,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: Spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    justifyContent: 'center',
  },
  userName: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.gray[600],
  },
  settingsButton: {
    padding: Spacing.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.gray[600],
  },
  statDivider: {
    width: 1,
    height: '60%',
    backgroundColor: Colors.gray[200],
    alignSelf: 'center',
  },
  section: {
    backgroundColor: Colors.background,
    marginBottom: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: Colors.text,
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.gray[600],
  },
  accountItem: {
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  accountItemText: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: Colors.text,
  },
  logoutButton: {
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.lg,
    borderColor: Colors.gray[400],
  },
  logoutButtonText: {
    color: Colors.gray[700],
  },
});