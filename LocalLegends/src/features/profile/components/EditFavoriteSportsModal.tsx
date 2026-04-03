import React, { useEffect, useState } from "react";
import { 
    Modal, 
    View, 
    Text, 
    TouchableOpacity, 
    ScrollView, 
    ActivityIndicator,
    Pressable,
    TouchableWithoutFeedback
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

    const handleClearAll = () => {
        setSelectedIds(new Set());
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
            transparent={true}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalContainer}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContent}>
                            <View style={styles.handle} />
                            
                            {/* Header */}
                            <View style={styles.header}>
                                <Text style={styles.modalTitle}>Favorite Sports</Text>
                                <TouchableOpacity onPress={onClose} disabled={isSaving}>
                                    <Ionicons name="close-circle" size={28} color="#cbd5e0" />
                                </TouchableOpacity>
                            </View>

                            <ScrollView showsVerticalScrollIndicator={false}>
                                <Text style={styles.subtitle}>
                                    Select the sports you love. These will appear on your public profile!
                                </Text>

                                {isLoadingSports ? (
                                    <View style={styles.loaderContainer}>
                                        <ActivityIndicator size="large" color={COLORS.primary} />
                                    </View>
                                ) : (
                                    <View style={styles.chipContainer}>
                                        {possibleSports.map((sport) => {
                                            const isSelected = selectedIds.has(sport.id);
                                            return (
                                                <TouchableOpacity
                                                    key={sport.id}
                                                    style={[
                                                        styles.chip,
                                                        isSelected && styles.chipActive
                                                    ]}
                                                    onPress={() => handleToggleSport(sport.id)}
                                                    disabled={isSaving}
                                                >
                                                    <Ionicons 
                                                        name={getSportIcon(sport.slug)} 
                                                        size={18} 
                                                        color={isSelected ? "#fff" : "#64748b"} 
                                                        style={{ marginRight: 6 }}
                                                    />
                                                    <Text style={[
                                                        styles.chipText,
                                                        isSelected && styles.chipTextActive
                                                    ]}>
                                                        {sport.name}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                )}
                            </ScrollView>

                            {/* Footer Actions */}
                            <View style={styles.footerContainer}>
                                <TouchableOpacity 
                                    style={styles.clearButton} 
                                    onPress={handleClearAll}
                                    disabled={isSaving}
                                >
                                    <Text style={styles.clearButtonText}>Clear All</Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity 
                                    style={styles.saveButton} 
                                    onPress={handleSave}
                                    disabled={isSaving}
                                >
                                    {isSaving ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <Text style={styles.saveButtonText}>Save Changes</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}