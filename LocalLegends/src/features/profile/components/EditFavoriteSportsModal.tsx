import React, { useEffect, useState, useMemo } from "react";
import { 
    Modal, 
    View, 
    Text, 
    TouchableOpacity, 
    ScrollView, 
    StyleSheet, 
    ActivityIndicator,
    Pressable
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProfile } from "../ProfileContext";
import Sport from "@/src/models/Sport";
import { GameApi } from "@/src/features/game/api/GameApi";
import { Ionicons } from "@expo/vector-icons";
import { EditFavoriteSportsThemes as styles } from "../themes/EditFavoriteSportsThemes";
import { COLORS } from "@/src/themes/themes";
import { ProfileApi } from "../api/ProfileApi";

interface EditFavoriteSportsModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function EditFavoriteSportsModal({ visible, onClose }: EditFavoriteSportsModalProps) {
    const { profile, refreshProfile } = useProfile();
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [possibleSports, setPossibleSports] = useState<Sport[]>([]);
    const [isLoadingSports, setIsLoadingSports] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Map sport slugs to Ionicons
    const getSportIcon = (slug: string): any => {
        const iconMap: Record<string, string> = {
            'basketball': 'basketball-outline',
            'soccer': 'football-outline',
            'football': 'american-football-outline',
            'tennis': 'tennisball-outline',
            'volleyball': 'volleyball-outline',
            'baseball': 'baseball-outline',
            'golf': 'golf-outline',
            'swimming': 'water-outline',
            'fitness': 'fitness-outline',
            'running': 'walk-outline',
            'cycling': 'bicycle-outline',
            'yoga': 'body-outline',
            'boxing': 'stopwatch-outline',
            'climbing': 'mountain-outline',
            'hiking': 'trail-sign-outline',
        };
        return iconMap[slug] || 'basketball-outline';
    };

    useEffect(() => {
        if (profile?.favoriteSports) {
            setSelectedIds(new Set(profile.favoriteSports.map(s => s.id)));
        }
    }, [profile, visible]);

    useEffect(() => {
        const fetchPossibleSports = async () => {
            setIsLoadingSports(true);
            try {
                const results = await GameApi.getSports();
                setPossibleSports(results.sports);
            } catch (error) {
                console.error("Error fetching sports:", error);
            } finally {
                setIsLoadingSports(false);
            }
        };
        if (visible) {
            fetchPossibleSports();
        }
    }, [visible]);

    const handleToggleSport = (sportId: string) => {
        const next = new Set(selectedIds);
        if (next.has(sportId)) {
            next.delete(sportId);
        } else {
            next.add(sportId);
        }
        setSelectedIds(next);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await ProfileApi.editFavoriteSports({ favoriteSportIds: Array.from(selectedIds) });
            if (res.success) {
                refreshProfile();
                onClose();
            }
        } catch (error) {
            console.error("Error saving favorite sports:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} disabled={isSaving}>
                        <Text style={styles.cancelButton}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Favorite Sports</Text>
                    <TouchableOpacity onPress={handleSave} disabled={isSaving}>
                        {isSaving ? (
                            <ActivityIndicator size="small" color={COLORS.primary} />
                        ) : (
                            <Text style={styles.doneButton}>Done</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {isLoadingSports ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                    </View>
                ) : (
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        <Text style={styles.subtitle}>
                            Select the sports you love. These will appear on your public profile!
                        </Text>
                        
                        <View style={styles.grid}>
                            {possibleSports.map((sport) => {
                                const isSelected = selectedIds.has(sport.id);
                                return (
                                    <Pressable
                                        key={sport.id}
                                        style={[
                                            styles.sportCard,
                                            isSelected && styles.sportCardSelected
                                        ]}
                                        onPress={() => handleToggleSport(sport.id)}
                                    >
                                        <View style={[
                                            styles.iconContainer,
                                            isSelected && styles.iconContainerSelected
                                        ]}>
                                            <Ionicons 
                                                name={getSportIcon(sport.slug)} 
                                                size={32} 
                                                color={isSelected ? "#fff" : "#64748b"} 
                                            />
                                        </View>
                                        <Text style={[
                                            styles.sportLabel,
                                            isSelected && styles.sportLabelSelected
                                        ]}>
                                            {sport.name}
                                        </Text>
                                        {isSelected && (
                                            <View style={styles.checkmark}>
                                                <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                                            </View>
                                        )}
                                    </Pressable>
                                );
                            })}
                        </View>
                    </ScrollView>
                )}
            </SafeAreaView>
        </Modal>
    );
}