import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface SettingOption {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  onPress: () => void;
}

export default function SettingsScreen() {
  const router = useRouter();

  const handleLogout = () => {
    console.log("TODO: Implement logout functionality");
  }

  const handleEditProfile = () => {
    console.log("TODO: Implement edit profile functionality");
  }

  const handleChangePassword = () => {
    console.log("TODO: Implement change password functionality");
  }

  const handleSportsPreferences = () => {
    console.log("TODO: Implement sports preferences functionality");
  }

  const handleNotificationPreferences = () => {
    console.log("TODO: Implement notification preferences functionality");
  }

  const handleDeleteAccount = () => {
    console.log("TODO: Implement delete account functionality");
  }

  const handleContactSupport = () => {
    console.log("TODO: Implement contact support functionality");
  }

  const handleViewTermsOfService = () => {
    console.log("TODO: Implement view terms of service functionality");
  }

  const handleViewPrivacyPolicy = () => {
    console.log("TODO: Implement view privacy policy functionality");
  }

  const accountSettingsOptions: SettingOption[] = [
    {
      id: 'edit-profile',
      title: 'Edit Profile',
      description: 'Update your personal information',
      icon: 'chevron-forward-outline',
      onPress: handleEditProfile,
    },
    {
      id: 'change-password',
      title: 'Change Password',
      description: 'Update your account password',
      icon: 'chevron-forward-outline',
      onPress: handleChangePassword,
    },
    {
      id: 'Sports Preferences',
      title: 'Edit Favorite Sports',
      description: 'Set your favorite sports',
      icon: 'chevron-forward-outline',
      onPress: handleSportsPreferences,
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Manage your notification preferences',
      icon: 'chevron-forward-outline',
      onPress: handleNotificationPreferences,
    }
  ];

  const dangerZoneOptions: SettingOption[] = [
    {
      id: 'logout',
      title: 'Logout',
      description: 'Sign out of your account',
      icon: 'log-out-outline',
      onPress: handleLogout,
    },
    {
      id: 'delete-account',
      title: 'Delete Account',
      description: 'Permanently delete your account and data',
      icon: 'trash-outline',
      onPress: handleDeleteAccount,
    }
  ];

  const supportOptions: SettingOption[] = [
    {
      id: 'report-bug',
      title: 'Report a Bug',
      description: 'Help us improve by reporting issues you encounter',
      icon: 'bug-outline',
      onPress: handleContactSupport,
    },
    {
      id: 'terms-of-service',
      title: 'Terms of Service',
      description: 'Read our terms and conditions',
      icon: 'document-text-outline',
      onPress: handleViewTermsOfService,
    },
    {
      id: 'privacy-policy',
      title: 'Privacy Policy',
      description: 'Learn how we handle your data',
      icon: 'shield-checkmark-outline',
      onPress: handleViewPrivacyPolicy,
    }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          {/* Left Side: Back Button */}
          <Pressable onPress={() => router.back()} style={styles.headerSide}>
            <Ionicons name="chevron-back" size={28} color="#111827" />
          </Pressable>

          {/* Center: The Title */}
          <Text style={styles.headerTitle}>Settings</Text>

          {/* Right Side: The Invisible Counterweight */}
          <View style={styles.headerSide} /> 
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.subtitle}>ACCOUNT SETTINGS</Text>
          {accountSettingsOptions.map((option) => (
            <Pressable key={option.id} onPress={option.onPress} style={styles.sectionCard}>
              <View style={styles.settingsRow}>
                <View style={styles.textLabelContainer}>
                  <Text style={styles.settingMainText}>{option.title}</Text>
                  <Text style={styles.settingSubtext}>{option.description}</Text>
                </View>
                <Ionicons name={option.icon} size={22} color="#111827" />
              </View>
            </Pressable>
          ))}
          <Text style={styles.subtitle}>SUPPORT</Text>
          {supportOptions.map((option) => (
            <Pressable key={option.id} onPress={option.onPress} style={styles.sectionCard}>
              <View style={styles.settingsRow}>
                <View style={styles.textLabelContainer}>
                  <Text style={styles.settingMainText}>{option.title}</Text>
                  <Text style={styles.settingSubtext}>{option.description}</Text>
                </View>
                <Ionicons name={option.icon} size={22} color="#111827" />
              </View>
            </Pressable>
          ))}
          <Text style={styles.subtitle}>DANGER ZONE</Text>
          {dangerZoneOptions.map((option) => (
            <Pressable key={option.id} onPress={option.onPress} style={styles.sectionCard}>
              <View style={styles.settingsRow}>
                <View style={styles.textLabelContainer}>
                  <Text style={styles.logoutText}>{option.title}</Text>
                  <Text style={styles.settingSubtext}>{option.description}</Text>
                </View>
                <Ionicons name={option.icon} size={22} color="#ef4444" />
              </View>
            </Pressable>
          ))}
        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerSide: {
    width: 40, 
    alignItems: 'flex-start', 
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center', 
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginLeft: 12,
    marginBottom: 10,
  },
  sectionLabelText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9ca3af', 
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: 12,
    marginBottom: 8,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingLeft: 16,
    marginBottom: 24, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2, 
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingRight: 16, 
    minHeight: 60, 
  },
  textLabelContainer: {
    flex: 1,
    gap: 2,
    paddingRight: 16,
  },
  settingMainText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
  },
  logoutText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#ef4444',
  },
  settingSubtext: {
    fontSize: 14,
    color: '#6b7280',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb', 
    width: '100%',
  },
});