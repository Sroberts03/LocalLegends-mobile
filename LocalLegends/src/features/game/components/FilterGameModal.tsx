import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback, ScrollView, Switch } from "react-native";
import Slider from '@react-native-community/slider';
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/src/themes/themes";
import { GameFilter, SkillLevel, GenderPreference } from "@/src/models/Game";
import Sport from '@/src/models/Sport';
import { GameApi } from '../api/GameApi';
import { FilterGameModalThemes as styles } from "./themes/FilterGameModal";

type FilterGameModalProps = {
    isVisible: boolean;
    setIsFilterModalVisible: (isVisible: boolean) => void;
    currentFilter: GameFilter;
    onApply: (newFilter: GameFilter) => void;
}

export default function FilterGameModal({ isVisible, setIsFilterModalVisible, currentFilter, onApply }: FilterGameModalProps) {
    const [localFilter, setLocalFilter] = useState<GameFilter>(currentFilter);
    const [sports, setSports] = useState<Sport[]>([]);

    useEffect(() => {
        if (isVisible) {
            setLocalFilter(currentFilter);
            fetchSports();
        }
    }, [isVisible, currentFilter]);

    const fetchSports = async () => {
        try {
            const response = await GameApi.getSports();
            setSports(response.sports);
        } catch (err) {
            console.error("Failed to fetch sports", err);
        }
    };

    const toggleSport = (sportId: string) => {
        const currentIds = localFilter.sportIds || [];
        const newIds = currentIds.includes(sportId)
            ? currentIds.filter(id => id !== sportId)
            : [...currentIds, sportId];
        setLocalFilter({ ...localFilter, sportIds: newIds });
    };

    const toggleSkillLevel = (level: SkillLevel) => {
        const currentLevels = localFilter.skillLevels || [];
        const newLevels = currentLevels.includes(level)
            ? currentLevels.filter(l => l !== level)
            : [...currentLevels, level];
        setLocalFilter({ ...localFilter, skillLevels: newLevels });
    };

    const toggleGenderPreference = (pref: GenderPreference) => {
        const currentPrefs = localFilter.genderPreferences || [];
        const newPrefs = currentPrefs.includes(pref)
            ? currentPrefs.filter(p => p !== pref)
            : [...currentPrefs, pref];
        setLocalFilter({ ...localFilter, genderPreferences: newPrefs });
    };

    const handleApply = () => {
        onApply(localFilter);
        setIsFilterModalVisible(false);
    };

    const handleClear = () => {
        const clearedFilter: GameFilter = {
            latitude: currentFilter.latitude,
            longitude: currentFilter.longitude,
            maxDistance: 25,
            sportIds: [],
            skillLevels: [],
            genderPreferences: [],
            favoritesOnly: false,
            happeningTodayOnly: false,
        };
        setLocalFilter(clearedFilter);
        onApply(clearedFilter);
        setIsFilterModalVisible(false);
    };

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setIsFilterModalVisible(false)}
        >
            <TouchableWithoutFeedback onPress={() => setIsFilterModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContent}>
                            <View style={styles.handle} />
                            
                            <View style={styles.header}>
                                <Text style={styles.modalTitle}>Filters</Text>
                                <TouchableOpacity onPress={() => setIsFilterModalVisible(false)}>
                                    <Ionicons name="close-circle" size={28} color="#cbd5e0" />
                                </TouchableOpacity>
                            </View>

                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                                {/* Quick Toggles */}
                                <View style={[styles.section, { flexDirection: 'row', gap: 16 }]}>
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f8fafc', padding: 12, borderRadius: 12 }}>
                                        <Text style={{ fontWeight: '600', color: '#475569' }}>Today</Text>
                                        <Switch 
                                            value={localFilter.happeningTodayOnly || false} 
                                            onValueChange={(val) => setLocalFilter({...localFilter, happeningTodayOnly: val})}
                                            trackColor={{ false: "#e2e8f0", true: COLORS.primary }}
                                        />
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f8fafc', padding: 12, borderRadius: 12 }}>
                                        <Text style={{ fontWeight: '600', color: '#475569' }}>Favorites</Text>
                                        <Switch 
                                            value={localFilter.favoritesOnly || false} 
                                            onValueChange={(val) => setLocalFilter({...localFilter, favoritesOnly: val})}
                                            trackColor={{ false: "#e2e8f0", true: COLORS.primary }}
                                        />
                                    </View>
                                </View>

                                {/* Distance Section */}
                                <View style={styles.section}>
                                    <View style={styles.sectionHeader}>
                                        <Text style={styles.sectionTitle}>Distance Range</Text>
                                        <Text style={styles.sectionValue}>{Math.round(localFilter.maxDistance)} miles</Text>
                                    </View>
                                    <Slider
                                        style={styles.sliderTrack}
                                        minimumValue={1}
                                        maximumValue={100}
                                        step={1}
                                        value={localFilter.maxDistance}
                                        onValueChange={(val) => setLocalFilter({ ...localFilter, maxDistance: val })}
                                        minimumTrackTintColor={COLORS.primary}
                                        maximumTrackTintColor="#e2e8f0"
                                        thumbTintColor={COLORS.primary}
                                    />
                                </View>

                                {/* Sports Section */}
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Sports</Text>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                                        {sports.map((sport) => {
                                            const isActive = localFilter.sportIds?.includes(sport.id);
                                            return (
                                                <TouchableOpacity
                                                    key={sport.id}
                                                    onPress={() => toggleSport(sport.id)}
                                                    style={{
                                                        paddingHorizontal: 16,
                                                        paddingVertical: 8,
                                                        borderRadius: 12,
                                                        backgroundColor: isActive ? COLORS.primary : '#f1f5f9',
                                                        borderWidth: 1,
                                                        borderColor: isActive ? COLORS.primary : '#e2e8f0',
                                                    }}
                                                >
                                                    <Text style={{ color: isActive ? '#fff' : '#475569', fontWeight: '600' }}>
                                                        {sport.name}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </View>

                                {/* Skill Level Section */}
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Skill Level</Text>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                                        {Object.values(SkillLevel).map((level) => {
                                            const isActive = localFilter.skillLevels?.includes(level);
                                            return (
                                                <TouchableOpacity
                                                    key={level}
                                                    onPress={() => toggleSkillLevel(level)}
                                                    style={{
                                                        paddingHorizontal: 16,
                                                        paddingVertical: 8,
                                                        borderRadius: 12,
                                                        backgroundColor: isActive ? COLORS.primary : '#f1f5f9',
                                                        borderWidth: 1,
                                                        borderColor: isActive ? COLORS.primary : '#e2e8f0',
                                                    }}
                                                >
                                                    <Text style={{ color: isActive ? '#fff' : '#475569', fontWeight: '600' }}>
                                                        {level}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </View>

                                {/* Gender Preference Section */}
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Gender Preference</Text>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                                        {Object.values(GenderPreference).map((pref) => {
                                            const isActive = localFilter.genderPreferences?.includes(pref);
                                            return (
                                                <TouchableOpacity
                                                    key={pref}
                                                    onPress={() => toggleGenderPreference(pref)}
                                                    style={{
                                                        paddingHorizontal: 16,
                                                        paddingVertical: 8,
                                                        borderRadius: 12,
                                                        backgroundColor: isActive ? COLORS.primary : '#f1f5f9',
                                                        borderWidth: 1,
                                                        borderColor: isActive ? COLORS.primary : '#e2e8f0',
                                                    }}
                                                >
                                                    <Text style={{ color: isActive ? '#fff' : '#475569', fontWeight: '600' }}>
                                                        {pref}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </View>
                            </ScrollView>

                            <View style={styles.footerContainer}>
                                <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
                                    <Text style={styles.clearButtonText}>Clear All</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                                    <Text style={styles.applyButtonText}>Apply Filters</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}