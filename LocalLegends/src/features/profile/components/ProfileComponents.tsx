import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { profileThemes as styles } from '../themes/ProfileScreenTheme';
import { COLORS } from '@/src/themes/themes';
import Sport from '@/src/models/Sport';
import { GameWithDetails } from '@/src/models/Game';

// 1. Individual Stat Card Component
export const StatCard = ({ label, value, icon }: { label: string, value: number | string, icon: any }) => (
    <View style={styles.statCard}>
        <Ionicons name={icon} size={20} color={COLORS.primary} style={{ marginBottom: 8 }} />
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
);

// 2. Profile Header Hero Component
interface ProfileHeaderProps {
    displayName: string;
    profileImageUrl?: string;
    bio?: string;
    onEditPress?: () => void;
}

export const ProfileHeader = ({ displayName, profileImageUrl, bio, onEditPress }: ProfileHeaderProps) => {
    const username = `@${displayName?.toLowerCase().replace(/\s+/g, '') || 'locallegend'}`;
    
    return (
        <View style={styles.headerGradient}>
            <View style={styles.avatarContainer}>
                {profileImageUrl ? (
                    <Image source={{ uri: profileImageUrl }} style={styles.avatar} />
                ) : (
                    <View style={styles.avatarFallback}>
                        <Ionicons name="person" size={50} color="rgba(0,0,0,0.1)" />
                    </View>
                )}
                <TouchableOpacity style={styles.editBadge} onPress={onEditPress}>
                    <Ionicons name="camera" size={16} color="#fff" />
                </TouchableOpacity>
            </View>
            <Text style={styles.name}>{displayName || 'Legendary Player'}</Text>
            <Text style={styles.username}>{username}</Text>
            {bio && (
                <Text style={styles.bio} numberOfLines={3}>{bio}</Text>
            )}
        </View>
    );
};

// 3. Favorite Sports Chips Component
export const SportsChips = ({ sports }: { sports: Sport[] }) => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>Favorite Sports</Text>
        <View style={styles.sportsList}>
            {sports && sports.length > 0 ? (
                sports.map((sport) => (
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
);

// 4. Recently Joined Activity List Component
interface ActivityListProps {
    games: GameWithDetails[];
    onGamePress?: (gameId: string) => void;
}

export const ActivityList = ({ games, onGamePress }: ActivityListProps) => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recently Joined</Text>
        {games && games.length > 0 ? (
            games.map((game) => {
                const isPast = new Date(game.game.startTime) < new Date();
                return (
                    <TouchableOpacity 
                        key={game.game.id} 
                        style={styles.gameCard}
                        onPress={() => onGamePress?.(game.game.id)}
                    >
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
);
