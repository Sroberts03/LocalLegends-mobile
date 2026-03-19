import { SafeAreaView, StyleSheet, ScrollView } from "react-native";
import React, { useEffect, useState, useMemo } from "react";
import MockProfileFacade from "@/src/server/mock/MockProfileFacade";
import { ProfileInfo } from "@/src/models/Profile"; // Changed from Profile to ProfileInfo
import UserProfile from "@/src/components/UserProfile";

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
});