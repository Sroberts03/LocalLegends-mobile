import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import 'react-native-url-polyfill/auto';
import * as Notifications from 'expo-notifications';
import { AuthProvider, useAuth } from '../features/auth/AuthContext';
import { GameProvider } from '../features/game/GameContext';
import { ProfileProvider } from '../features/profile/ProfileContext';
import { registerForPushNotificationsAsync } from '../utils/notificationUtils';
import { ProfileApi } from '../features/profile/api/ProfileApi';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function InitialLayout() {
  const { session, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const setupNotifications = async () => {
      if (session) {
        try {
          const token = await registerForPushNotificationsAsync();
          if (token) {
            await ProfileApi.editProfile({ pushToken: token });
          }
        } catch (err) {
          console.error('Failed to save push token to profile:', err);
        }
      }
    };
    
    setupNotifications();
  }, [session]);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      router.replace('/(auth)/Login');

    } else if (session && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [session, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <GameProvider>
        <ProfileProvider>
          <InitialLayout />
        </ProfileProvider>
      </GameProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});