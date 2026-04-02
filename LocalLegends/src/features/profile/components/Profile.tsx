import React from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProfile } from '../ProfileContext';
import { profileThemes as styles } from '../themes/ProfileScreenTheme';
import { COLORS } from '@/src/themes/themes';
import { AuthApi } from '@/src/features/auth/api/AuthApi';
import { 
    StatCard, 
    ProfileHeader, 
    SportsChips, 
    ActivityList 
} from './ProfileComponents';

export default function Profile() {
    const { profile, isLoading, refreshProfile } = useProfile();

    if (isLoading && !profile) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Loading Profile...</Text>
            </View>
        );
    }

    if (!profile) {
        return (
            <View style={styles.centerContainer}>
                <Ionicons name="alert-circle-outline" size={48} color="rgba(0,0,0,0.2)" />
                <Text style={styles.loadingText}>Profile not found</Text>
                <TouchableOpacity onPress={AuthApi.logout} style={[styles.logoutButton, { marginTop: 20 }]}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const rowStats = [
        { label: 'Joined', value: profile.totalGamesJoined, icon: 'people' },
        { label: 'Hosted', value: profile.totalGamesHosted, icon: 'star' },
        { label: 'Reliability', value: profile.reliabilityScore ?? 100, icon: 'shield-checkmark' }
    ];

    return (
        <ScrollView 
            style={styles.container}
            contentContainerStyle={{ paddingBottom: 100 }} // Space for tab bar
            refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={refreshProfile} tintColor={COLORS.primary} />
            }
        >
            {/* Modular Header */}
            <ProfileHeader 
                displayName={profile.displayName}
                profileImageUrl={profile.profileImageUrl}
                bio={profile.bio}
                onEditPress={() => console.log('Edit Profile Pressed')}
            />

            {/* Modular Stats */}
            <View style={styles.statsRow}>
                {rowStats.map((stat, idx) => (
                    <StatCard key={idx} label={stat.label} value={stat.value} icon={stat.icon} />
                ))}
            </View>

            {/* Modular Sports List */}
            <SportsChips sports={profile.favoriteSports} />

            {/* Modular Activity List */}
            <ActivityList 
                games={profile.last5Games} 
                onGamePress={(id) => console.log('Game Pressed:', id)}
            />
        </ScrollView>
    );
}