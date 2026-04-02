import React, { useEffect, useState, useMemo } from "react";
import { View, Text, SectionList, ActivityIndicator, RefreshControl, TouchableOpacity } from "react-native";
import { GameApi } from "../api/GameApi";
import { GameWithDetails } from "@/src/models/Game";
import GameCard from "./GameCard";
import GameDetailsModal from "./GameDetailsModal";
import { MyGamesThemes as styles } from "./themes/MyGamesThemes";
import { COLORS } from "@/src/themes/themes";
import { Ionicons } from "@expo/vector-icons";

type Section = {
    title: string;
    data: GameWithDetails[];
};

export default function MyGames() {
    const [myGames, setMyGames] = useState<GameWithDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    // Modal State
    const [selectedGame, setSelectedGame] = useState<GameWithDetails | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const fetchMyGames = async (showLoading = true) => {
        if (showLoading) setIsLoading(true);
        try {
            const res = await GameApi.getMyGames();
            console.log("DEBUG: MyGames API Response:", JSON.stringify(res, null, 2));
            
            // Ensure dates are actual Date objects if they come back as strings
            const sanitizedGames = res.games.map(g => ({
                ...g,
                game: { ...g.game, startTime: new Date(g.game.startTime) }
            }));
            console.log("DEBUG: Sanitized Games Count:", sanitizedGames.length);
            setMyGames(sanitizedGames);
        } catch (error) {
            console.error("Error fetching my games:", error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchMyGames();
    }, []);

    const onRefresh = () => {
        setIsRefreshing(true);
        fetchMyGames(false);
    };

    const handleGameCardPress = (game: GameWithDetails) => {
        console.log("DEBUG: Game Card Clicked:", game.game.name);
        setSelectedGame(game);
        setIsModalVisible(true);
    };

    const handleJoin = async () => {
        if (!selectedGame) return;
        try {
            await GameApi.joinGame({ gameId: selectedGame.game.id });
            fetchMyGames(false);
        } catch (error) {
            console.log("Error joining game:", error);
        }
    };

    const handleLeave = async () => {
        if (!selectedGame) return;
        try {
            await GameApi.leaveGame({ gameId: selectedGame.game.id });
            fetchMyGames(false);
        } catch (error) {
            console.log("Error leaving game:", error);
        }
    };

    const groupedGames = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        const sections: Record<string, GameWithDetails[]> = {
            "Today": [],
            "Tomorrow": [],
            "This Week": [],
            "Later": []
        };

        myGames.forEach(gameData => {
            const gameDate = new Date(gameData.game.startTime);
            gameDate.setHours(0, 0, 0, 0);

            if (gameDate.getTime() === today.getTime()) {
                sections["Today"].push(gameData);
            } else if (gameDate.getTime() === tomorrow.getTime()) {
                sections["Tomorrow"].push(gameData);
            } else if (gameDate.getTime() < nextWeek.getTime() && gameDate.getTime() > tomorrow.getTime()) {
                sections["This Week"].push(gameData);
            } else if (gameDate.getTime() >= nextWeek.getTime()) {
                sections["Later"].push(gameData);
            }
        });

        return Object.entries(sections)
            .filter(([_, data]) => data.length > 0)
            .map(([title, data]): Section => ({ title, data }));
    }, [myGames]);

    if (isLoading) {
        return (
            <View style={[styles.container, { justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    console.log("DEBUG: MyGames Render - isModalVisible:", isModalVisible, "selectedGame:", !!selectedGame);
    return (
        <View style={styles.container}>
            <SectionList
                sections={groupedGames}
                keyExtractor={(item) => item.game.id.toString()}
                renderItem={({ item }) => (
                    <GameCard 
                        data={item} 
                        onPress={() => handleGameCardPress(item)} 
                    />
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.sectionHeader}>{title}</Text>
                )}
                contentContainerStyle={styles.listContent}
                stickySectionHeadersEnabled={false}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
                }
                ListHeaderComponent={() => (
                    <View style={{ marginBottom: 10 }}>
                        <Text style={{ fontSize: 28, fontWeight: '800', color: COLORS.text }}>Schedule</Text>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="calendar-outline" size={80} color={COLORS.border} />
                        <Text style={styles.emptyTitle}>No Games Yet</Text>
                        <Text style={styles.emptySubtitle}>
                            Your schedule is looking a bit empty. Ready to hit the court?
                        </Text>
                        <TouchableOpacity style={styles.findButton}>
                            <Text style={styles.findButtonText}>Find a Game</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

            <GameDetailsModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                game={selectedGame!}
                onJoin={handleJoin}
                onLeave={handleLeave}
            />
        </View>
    );
}