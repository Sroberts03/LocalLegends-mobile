import { StyleSheet, ScrollView, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "expo-router";
import MockProfileFacade from "@/src/server/mock/MockProfileFacade";
import { ProfileInfo } from "@/src/models/Profile"; // Changed from Profile to ProfileInfo
import UserProfile from "@/src/components/UserProfile";
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileInfo | null>(null); // Updated Type
  const server = useMemo(() => new MockProfileFacade(), []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await server.me();
        setProfile(profileData);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, [server]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ScrollView needs contentContainerStyle to pad its inside */}
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