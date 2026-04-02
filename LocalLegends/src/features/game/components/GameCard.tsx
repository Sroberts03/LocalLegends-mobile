import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GameWithDetails } from "@/src/models/Game";
import { MyGamesThemes as styles } from "./themes/MyGamesThemes";
import { COLORS } from "@/src/themes/themes";
import { getSportIcon } from "./utils/MapUtil";

type GameCardProps = {
    data: GameWithDetails;
    onPress?: () => void;
}

export default function GameCard({ data, onPress }: GameCardProps) {
    const startTime = new Date(data.game.startTime);
    const endTime = new Date(data.game.endTime);
    const timeString = `${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    
    return (
        <TouchableOpacity 
            style={styles.card} 
            onPress={() => {
                console.log("DEBUG: Card Touchable - Game:", data.game.name);
                onPress?.();
            }} 
            activeOpacity={0.7}
        >
            <View style={styles.iconContainer}>
                <Ionicons 
                    name={getSportIcon(data.sportName)} 
                    size={28} 
                    color={COLORS.primary} 
                />
                {data.memberProfiles && data.memberProfiles.length > 0 && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{data.memberProfiles.length}</Text>
                    </View>
                )}
            </View>

            <View style={styles.cardInfo}>
                <Text style={styles.gameName} numberOfLines={1}>
                    {data.game.name}
                </Text>
                
                <View style={styles.locationContainer}>
                    <Ionicons name="location-sharp" size={14} color={COLORS.textSecondary} />
                    <Text style={styles.locationText} numberOfLines={1}>
                        {data.locationName}
                    </Text>
                </View>

                <View style={styles.timeContainer}>
                    <Ionicons name="time" size={14} color={COLORS.primary} />
                    <Text style={styles.timeText}>
                        {timeString}
                    </Text>
                </View>
            </View>

            <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={COLORS.border} 
                style={styles.chevron} 
            />
        </TouchableOpacity>
    );
}