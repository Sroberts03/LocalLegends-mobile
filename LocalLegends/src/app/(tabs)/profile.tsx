import { StyleSheet, ScrollView, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useMemo, useCallback } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import MockProfileFacade from "@/src/server/mock/MockProfileFacade";
import { ProfileInfo } from "@/src/models/Profile"; 
import UserProfile from "@/src/components/UserProfile";
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileInfo | null>(null); 
  const server = useMemo(() => new MockProfileFacade(), []);

  // 1. Fetch data returning the value, rather than setting state directly
  const fetchData = useCallback(async () => {
    try {
      return await server.me();
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      return null;
    }
  }, [server]);

  // 2. Correct useFocusEffect syntax (wrapping the logic in useCallback)
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      const loadProfile = async () => {
        const profileData = await fetchData();
        
        // 3. The safe check: Only update state if the user hasn't left the screen yet
        if (isMounted && profileData) {
          setProfile(profileData);
        }
      };

      loadProfile();

      // Cleanup function runs when the screen loses focus
      return () => {
        isMounted = false;
      };
    }, [fetchData]) // Dependencies go here inside the useCallback
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Pressable onPress={() => router.push('/notifications')}>
          <Ionicons name="notifications-outline" size={30} color="#4f46e5" />
        </Pressable>
        <Pressable onPress={() => router.push('/settings')}>
          <Ionicons name="settings-outline" size={30} color="#4f46e5" />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <UserProfile profile={profile} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    padding: 16,
    alignItems: "center",
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 24, 
    paddingTop: 16,
    paddingBottom: 8,
    width: '100%',
  },
});