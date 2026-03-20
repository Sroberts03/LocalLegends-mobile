import { SafeAreaView, StyleSheet, ScrollView, View } from "react-native";
import React, { useEffect, useState, useMemo } from "react";
import MockProfileFacade from "@/src/server/mock/MockProfileFacade";
import { ProfileInfo } from "@/src/models/Profile"; // Changed from Profile to ProfileInfo
import UserProfile from "@/src/components/UserProfile";
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
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
        <Ionicons name="notifications-outline" size={30} color="#4f46e5" />
        <Ionicons name="settings-outline" size={30} color="#4f46e5" />
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