import React from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { gameDetailsModalThemes } from "./themes/GameDetailsModalTheme";

interface PlayerAvatarProps {
    profile: any;
    index: number;
}

export const PlayerAvatar = ({ profile, index }: PlayerAvatarProps) => (
    <View style={gameDetailsModalThemes.playerAvatarWrapper}>
        <View style={gameDetailsModalThemes.avatar}>
            {profile.profileImageUrl ? (
                <Image
                    source={{ uri: profile.profileImageUrl }}
                    style={gameDetailsModalThemes.avatarImage}
                />
            ) : (
                <Ionicons name="person" size={24} color="#94a3b8" />
            )}
        </View>
        <Text style={gameDetailsModalThemes.playerName} numberOfLines={1}>
            {profile.displayName ? profile.displayName.split(' ')[0] : 'Legend'}
        </Text>
    </View>
);

interface StatItemProps {
    icon: any;
    color: string;
    label: string;
    value: string | number;
}

export const StatItem = ({ icon, color, label, value }: StatItemProps) => (
    <View style={gameDetailsModalThemes.statItem}>
        <View style={gameDetailsModalThemes.statIconBox}>
            <Ionicons name={icon} size={16} color={color} />
        </View>
        <View style={gameDetailsModalThemes.statContent}>
            <Text style={gameDetailsModalThemes.statLabel}>{label}</Text>
            <Text style={gameDetailsModalThemes.statValue}>{value}</Text>
        </View>
    </View>
);
