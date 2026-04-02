import { View, Text, TouchableOpacity, ScrollView, Modal, ActivityIndicator, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { gameDetailsModalThemes } from "./themes/GameDetailsModalTheme";
import { GameWithDetails } from "@/src/models/Game";
import { COLORS } from "@/src/themes/themes";

type GameDetailsModalProps = {
    visible: boolean;
    onClose: () => void;
    game: GameWithDetails;
    onJoin?: () => void;
    onLeave?: () => void;
}

export default function GameDetailsModal({ visible, onClose, game, onJoin, onLeave }: GameDetailsModalProps) {
    console.log("DEBUG: GameDetailsModal - visible:", visible, "game:", !!game);

    const startTime = game?.game?.startTime ? new Date(game.game.startTime) : new Date();
    const endTime = game?.game?.endTime ? new Date(game.game.endTime) : new Date();

    const dateString = startTime.toLocaleDateString([], {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });

    const timeString = `${startTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    })} - ${endTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    })}`;

    const handleAction = () => {
        if (!game) return;
        if (game.userHasJoined) {
            onLeave?.();
        } else {
            onJoin?.();
        }
        onClose();
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={gameDetailsModalThemes.modalContainer}>
                {!game ? (
                    <View style={[gameDetailsModalThemes.modalContent, { height: 200, justifyContent: 'center', alignItems: 'center' }]}>
                        <ActivityIndicator color={COLORS.primary} size="large" />
                    </View>
                ) : (
                    <View style={gameDetailsModalThemes.modalContent}>
                        <View style={gameDetailsModalThemes.handle} />

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={gameDetailsModalThemes.scrollContent}
                        >
                            {/* Hero Section */}
                            <View style={gameDetailsModalThemes.heroSection}>
                                <View style={gameDetailsModalThemes.iconHalo}>
                                    <Ionicons
                                        name={game?.sportName ? (game.sportName.toLowerCase().includes('basketball') ? 'basketball' : 'football') : 'trophy'}
                                        size={40}
                                        color={COLORS.primary}
                                    />
                                </View>
                                <Text style={gameDetailsModalThemes.gameTitle}>{game?.game?.name || "Game Details"}</Text>
                                <View style={gameDetailsModalThemes.sportBadge}>
                                    <Text style={gameDetailsModalThemes.sportText}>{game?.sportName}</Text>
                                </View>
                                {game?.game?.isRecurring && (
                                    <View style={[gameDetailsModalThemes.sportBadge, { backgroundColor: '#8b5cf6', marginTop: 4 }]}>
                                        <Text style={gameDetailsModalThemes.sportText}>Recurring</Text>
                                    </View>
                                )}
                            </View>

                            {/* Time & Location Cards */}
                            <View style={gameDetailsModalThemes.cardGrid}>
                                <View style={gameDetailsModalThemes.mainCard}>
                                    <View style={gameDetailsModalThemes.cardIconRow}>
                                        <Ionicons name="time" size={16} color={COLORS.primary} />
                                        <Text style={gameDetailsModalThemes.cardLabel}>Schedule</Text>
                                    </View>
                                    <Text style={gameDetailsModalThemes.cardValue}>
                                        {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                    <Text style={gameDetailsModalThemes.cardSubValue}>{startTime.toLocaleDateString([], { month: 'short', day: 'numeric' })}</Text>
                                </View>
                                <View style={gameDetailsModalThemes.mainCard}>
                                    <View style={gameDetailsModalThemes.cardIconRow}>
                                        <Ionicons name="location" size={16} color="#e11d48" />
                                        <Text style={gameDetailsModalThemes.cardLabel}>Location</Text>
                                    </View>
                                    <Text style={gameDetailsModalThemes.cardValue} numberOfLines={1}>{game?.locationName}</Text>
                                    <Text style={gameDetailsModalThemes.cardSubValue}>View on Map</Text>
                                </View>
                            </View>

                            {/* Stats Grid */}
                            <View style={gameDetailsModalThemes.statsGrid}>
                                <View style={gameDetailsModalThemes.statItem}>
                                    <View style={gameDetailsModalThemes.statIconBox}>
                                        <Ionicons name="trending-up" size={16} color="#6366f1" />
                                    </View>
                                    <View style={gameDetailsModalThemes.statContent}>
                                        <Text style={gameDetailsModalThemes.statLabel}>Skill</Text>
                                        <Text style={gameDetailsModalThemes.statValue}>{game?.game?.skillLevel || 'N/A'}</Text>
                                    </View>
                                </View>
                                <View style={gameDetailsModalThemes.statItem}>
                                    <View style={gameDetailsModalThemes.statIconBox}>
                                        <Ionicons name="people" size={16} color="#ec4899" />
                                    </View>
                                    <View style={gameDetailsModalThemes.statContent}>
                                        <Text style={gameDetailsModalThemes.statLabel}>Gender</Text>
                                        <Text style={gameDetailsModalThemes.statValue}>{game?.game?.genderPreference || 'Any'}</Text>
                                    </View>
                                </View>
                                <View style={gameDetailsModalThemes.statItem}>
                                    <View style={gameDetailsModalThemes.statIconBox}>
                                        <Ionicons
                                            name={game?.game?.accessType === 'private' ? 'lock-closed' : 'lock-open'}
                                            size={16}
                                            color={game?.game?.accessType === 'private' ? '#ef4444' : '#f59e0b'}
                                        />
                                    </View>
                                    <View style={gameDetailsModalThemes.statContent}>
                                        <Text style={gameDetailsModalThemes.statLabel}>Access</Text>
                                        <Text style={gameDetailsModalThemes.statValue}>
                                            {game?.game?.accessType ? (game.game.accessType.charAt(0).toUpperCase() + game.game.accessType.slice(1)) : 'Public'}
                                        </Text>
                                    </View>
                                </View>
                                <View style={gameDetailsModalThemes.statItem}>
                                    <View style={gameDetailsModalThemes.statIconBox}>
                                        <Ionicons name="repeat" size={16} color="#8b5cf6" />
                                    </View>
                                    <View style={gameDetailsModalThemes.statContent}>
                                        <Text style={gameDetailsModalThemes.statLabel}>Recurring</Text>
                                        <Text style={gameDetailsModalThemes.statValue}>{game?.game?.isRecurring ? 'Weekly' : 'One-time'}</Text>
                                    </View>
                                </View>
                                <View style={gameDetailsModalThemes.statItem}>
                                    <View style={gameDetailsModalThemes.statIconBox}>
                                        <Ionicons name="person-add" size={16} color="#10b981" />
                                    </View>
                                    <View style={gameDetailsModalThemes.statContent}>
                                        <Text style={gameDetailsModalThemes.statLabel}>Spots Left</Text>
                                        <Text style={gameDetailsModalThemes.statValue}>{(game?.game?.maxPlayers || 0) - (game?.game?.currentPlayerCount || 0)}</Text>
                                    </View>
                                </View>
                                <View style={gameDetailsModalThemes.statItem}>
                                    <View style={gameDetailsModalThemes.statIconBox}>
                                        <Ionicons name="man" size={16} color="#3b82f6" />
                                    </View>
                                    <View style={gameDetailsModalThemes.statContent}>
                                        <Text style={gameDetailsModalThemes.statLabel}>Min Players</Text>
                                        <Text style={gameDetailsModalThemes.statValue}>{game?.game?.minPlayers || 0}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Description */}
                            {game?.game?.description && (
                                <View style={gameDetailsModalThemes.descriptionBox}>
                                    <Text style={gameDetailsModalThemes.descriptionHeader}>Host's Note</Text>
                                    <Text style={gameDetailsModalThemes.descriptionText}>
                                        "{game?.game?.description}"
                                    </Text>
                                </View>
                            )}

                            {/* Players Section */}
                            <View style={gameDetailsModalThemes.sectionTitleRow}>
                                <Text style={gameDetailsModalThemes.sectionTitle}>Players Joined</Text>
                                <View style={gameDetailsModalThemes.countBadge}>
                                    <Text style={gameDetailsModalThemes.countText}>
                                        {game?.game?.currentPlayerCount} / {game?.game?.maxPlayers}
                                    </Text>
                                </View>
                            </View>

                            <View style={gameDetailsModalThemes.playersGrid}>
                                {game?.memberProfiles && game.memberProfiles.length > 0 ? (
                                    game.memberProfiles.map((profile, index) => (
                                        <View key={profile.id || index} style={gameDetailsModalThemes.playerAvatarWrapper}>
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
                                                {profile.displayName.split(' ')[0]}
                                            </Text>
                                        </View>
                                    ))
                                ) : (
                                    <Text style={{ color: '#94a3b8', fontStyle: 'italic', marginLeft: 4 }}>No players joined yet</Text>
                                )}
                            </View>
                        </ScrollView>

                        {/* Footer Actions */}
                        <View style={gameDetailsModalThemes.footerContainer}>
                            <TouchableOpacity
                                style={gameDetailsModalThemes.clearButton}
                                onPress={onClose}
                            >
                                <Text style={gameDetailsModalThemes.clearButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={gameDetailsModalThemes.applyButton}
                                onPress={handleAction}
                            >
                                <Text style={gameDetailsModalThemes.applyButtonText}>
                                    {game?.userHasJoined ? "Leave Game" : "Join Game"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </Modal>
    );
}