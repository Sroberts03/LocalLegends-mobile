import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProfile } from '../ProfileContext';
import { profileThemes as styles } from '../themes/ProfileScreenTheme';
import { COLORS } from '@/src/themes/themes';
import { AuthApi } from '@/src/features/auth/api/AuthApi';

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

    const StatCard = ({ label, value, icon }: { label: string, value: number, icon: any }) => (
        <View style={styles.statCard}>
            <Ionicons name={icon} size={20} color={COLORS.primary} style={{ marginBottom: 8 }} />
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );

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
            {/* Hero Header */}
            <View style={styles.headerGradient}>
                <View style={styles.avatarContainer}>
                    {profile.profileImageUrl ? (
                        <Image source={{ uri: profile.profileImageUrl }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarFallback}>
                            <Ionicons name="person" size={50} color="rgba(0,0,0,0.1)" />
                        </View>
                    )}
                    <TouchableOpacity style={styles.editBadge}>
                        <Ionicons name="camera" size={16} color="#fff" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.name}>{profile.displayName || 'Legendary Player'}</Text>
                <Text style={styles.username}>@{profile.displayName?.toLowerCase().replace(/\s+/g, '') || 'locallegend'}</Text>
                {profile.bio && (
                    <Text style={styles.bio} numberOfLines={3}>{profile.bio}</Text>
                )}
            </View>

            {/* Stats Section */}
            <View style={styles.statsRow}>
                {rowStats.map((stat, idx) => (
                    <StatCard key={idx} label={stat.label} value={stat.value} icon={stat.icon} />
                ))}
            </View>

            {/* Favorite Sports */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Favorite Sports</Text>
                <View style={styles.sportsList}>
                    {profile.favoriteSports && profile.favoriteSports.length > 0 ? (
                        profile.favoriteSports.map((sport) => (
                            <View key={sport.id} style={styles.sportChip}>
                                <Ionicons 
                                    name={sport.name.toLowerCase().includes('basketball') ? 'basketball' : 'football'} 
                                    size={16} 
                                    color={COLORS.primary} 
                                />
                                <Text style={styles.sportText}>{sport.name}</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={{ color: 'rgba(0,0,0,0.3)' }}>No favorite sports set</Text>
                    )}
                </View>
            </View>

            {/* Recently Joined Games */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recently Joined</Text>
                {profile.last5Games && profile.last5Games.length > 0 ? (
                    profile.last5Games.map((game) => {
                        const isPast = new Date(game.game.startTime) < new Date();
                        return (
                            <TouchableOpacity key={game.game.id} style={styles.gameCard}>
                                <View style={styles.gameIconBox}>
                                    <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
                                </View>
                                <View style={styles.gameInfo}>
                                    <Text style={styles.gameName}>{game.game.name}</Text>
                                    <Text style={styles.gameDate}>
                                        {new Date(game.game.startTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                    </Text>
                                </View>
                                {isPast && (
                                    <View style={styles.gameStatus}>
                                        <Text style={styles.statusText}>COMPLETED</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })
                ) : (
                    <Text style={{ color: 'rgba(0,0,0,0.3)' }}>No recently joined games</Text>
                )}
            </View>

            {/* Logout Button */}
            <TouchableOpacity onPress={AuthApi.logout} style={styles.logoutButton}>
                <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}