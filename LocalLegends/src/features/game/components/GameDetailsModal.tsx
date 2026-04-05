import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { gameDetailsModalThemes } from "./themes/GameDetailsModalTheme";
import { GameWithDetails } from "@/src/models/Game";
import { COLORS } from "@/src/themes/themes";
import { PlayerAvatar, StatItem } from "./GameDetailsComponents";
import { getSportIcon } from "../../common/SportIcon";

type GameDetailsModalProps = {
    visible: boolean;
    onClose: () => void;
    game: GameWithDetails;
    onJoin?: () => void;
    onLeave?: () => void;
    onAddressPress: (game: GameWithDetails) => void;
}

export default function GameDetailsModal(
    { visible, onClose, game, onJoin, onLeave, onAddressPress }: GameDetailsModalProps
) {
    const startTime = game?.game?.startTime ? new Date(game.game.startTime) : new Date();
    const endTime = game?.game?.endTime ? new Date(game.game.endTime) : new Date();

    const dateString = startTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

    const handleAction = () => {
        if (!game) return;
        game.userHasJoined ? onLeave?.() : onJoin?.();
        onClose();
    };

    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={gameDetailsModalThemes.modalContainer}>
                {!game ? (
                    <View style={[gameDetailsModalThemes.modalContent, { height: 200, justifyContent: 'center', alignItems: 'center' }]}>
                        <ActivityIndicator color={COLORS.primary} size="large" />
                    </View>
                ) : (
                    <View style={gameDetailsModalThemes.modalContent}>
                        <View style={gameDetailsModalThemes.handle} />
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={gameDetailsModalThemes.scrollContent}>
                            {/* Hero Section */}
                            <View style={gameDetailsModalThemes.heroSection}>
                                <View style={gameDetailsModalThemes.iconHalo}>
                                    <Ionicons
                                        name={getSportIcon(game?.sportName)}
                                        size={40} color={COLORS.primary}
                                    />
                                </View>
                                <Text style={gameDetailsModalThemes.gameTitle}>{game?.game?.name || "Game Details"}</Text>
                                <View style={gameDetailsModalThemes.sportBadge}><Text style={gameDetailsModalThemes.sportText}>{game?.sportName}</Text></View>
                                {game?.game?.isRecurring && (
                                    <View style={[gameDetailsModalThemes.sportBadge, { backgroundColor: '#8b5cf6', marginTop: 4 }]}>
                                        <Text style={gameDetailsModalThemes.sportText}>Recurring</Text>
                                    </View>
                                )}
                            </View>

                            {/* Time & Location Cards */}
                            <View style={gameDetailsModalThemes.cardGrid}>
                                <View style={gameDetailsModalThemes.mainCard}>
                                    <View style={gameDetailsModalThemes.cardIconRow}><Ionicons name="time" size={16} color={COLORS.primary} /><Text style={gameDetailsModalThemes.cardLabel}>Schedule</Text></View>
                                    <Text style={gameDetailsModalThemes.cardValue}>{startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                                    <Text style={gameDetailsModalThemes.cardSubValue}>{startTime.toLocaleDateString([], { month: 'short', day: 'numeric' })}</Text>
                                </View>
                                <TouchableOpacity onPress={() => onAddressPress(game)}>
                                    <View style={gameDetailsModalThemes.mainCard}>
                                        <View style={gameDetailsModalThemes.cardIconRow}><Ionicons name="location" size={16} color="#e11d48" /><Text style={gameDetailsModalThemes.cardLabel}>Location</Text></View>
                                        <Text style={gameDetailsModalThemes.cardValue} numberOfLines={1}>{game?.locationName}</Text>
                                        <Text style={gameDetailsModalThemes.cardSubValue}>View on Map</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            {/* Stats Grid */}
                            <View style={gameDetailsModalThemes.statsGrid}>
                                <StatItem icon="trending-up" color="#6366f1" label="Skill" value={game?.game?.skillLevel || 'N/A'} />
                                <StatItem icon="people" color="#ec4899" label="Gender" value={game?.game?.genderPreference || 'Any'} />
                                <StatItem
                                    icon={game?.game?.accessType === 'private' ? 'lock-closed' : 'lock-open'}
                                    color={game?.game?.accessType === 'private' ? '#ef4444' : '#f59e0b'}
                                    label="Access"
                                    value={game?.game?.accessType ? (game.game.accessType.charAt(0).toUpperCase() + game.game.accessType.slice(1)) : 'Public'}
                                />
                                <StatItem icon="repeat" color="#8b5cf6" label="Recurring" value={game?.game?.isRecurring ? 'Weekly' : 'One-time'} />
                                <StatItem icon="person-add" color="#10b981" label="Spots Left" value={(game?.game?.maxPlayers || 0) - (game?.game?.currentPlayerCount || 0)} />
                                <StatItem icon="man" color="#3b82f6" label="Min Players" value={game?.game?.minPlayers || 0} />
                            </View>

                            {/* Description */}
                            {game?.game?.description && (
                                <View style={gameDetailsModalThemes.descriptionBox}>
                                    <Text style={gameDetailsModalThemes.descriptionHeader}>Host's Note</Text>
                                    <Text style={gameDetailsModalThemes.descriptionText}>"{game?.game?.description}"</Text>
                                </View>
                            )}

                            {/* Players Section */}
                            <View style={gameDetailsModalThemes.sectionTitleRow}>
                                <Text style={gameDetailsModalThemes.sectionTitle}>Players Joined</Text>
                                <View style={gameDetailsModalThemes.countBadge}>
                                    <Text style={gameDetailsModalThemes.countText}>{game?.game?.currentPlayerCount} / {game?.game?.maxPlayers}</Text>
                                </View>
                            </View>

                            <View style={gameDetailsModalThemes.playersGrid}>
                                {game?.memberProfiles && game.memberProfiles.length > 0 ? (
                                    game.memberProfiles.map((p, i) => <PlayerAvatar key={p.id || i} profile={p} index={i} />)
                                ) : (
                                    <Text style={{ color: '#94a3b8', fontStyle: 'italic', marginLeft: 4 }}>No players joined yet</Text>
                                )}
                            </View>
                        </ScrollView>

                        {/* Footer Actions */}
                        <View style={gameDetailsModalThemes.footerContainer}>
                            <TouchableOpacity style={gameDetailsModalThemes.clearButton} onPress={onClose}>
                                <Text style={gameDetailsModalThemes.clearButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={gameDetailsModalThemes.applyButton} onPress={handleAction}>
                                <Text style={gameDetailsModalThemes.applyButtonText}>{game?.userHasJoined ? "Leave Game" : "Join Game"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </Modal>
    );
}