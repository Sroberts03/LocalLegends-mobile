import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback, ScrollView, Switch } from "react-native";
import Slider from '@react-native-community/slider';
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/src/themes/themes";
import { GameFilter, SkillLevel, GenderPreference } from "@/src/models/Game";
import Sport from '@/src/models/Sport';
import { GameApi } from '../api/GameApi';
import { FilterGameModalThemes as styles } from "./themes/FilterGameModal";
import { FilterChip } from './filter/FilterChip';
import { FilterSection } from './filter/FilterSection';

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

    const toggle = (key: keyof GameFilter, value: any) => {
        const currentArr = localFilter[key] as any[] || [];
        const newArr = currentArr.includes(value)
            ? currentArr.filter(i => i !== value)
            : [...currentArr, value];
        setLocalFilter({ ...localFilter, [key]: newArr });
    };

    const handleApply = () => { onApply(localFilter); setIsFilterModalVisible(false); };
    const handleClear = () => {
        const cleared: GameFilter = { ...currentFilter, maxDistance: 25, sportIds: [], skillLevels: [], genderPreferences: [], favoritesOnly: false, happeningTodayOnly: false };
        setLocalFilter(cleared); onApply(cleared); setIsFilterModalVisible(false);
    };

    return (
        <Modal visible={isVisible} animationType="slide" transparent onRequestClose={() => setIsFilterModalVisible(false)}>
            <TouchableWithoutFeedback onPress={() => setIsFilterModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContent}>
                            <View style={styles.handle} /><View style={styles.header}>
                                <Text style={styles.modalTitle}>Filters</Text>
                                <TouchableOpacity onPress={() => setIsFilterModalVisible(false)}><Ionicons name="close-circle" size={28} color="#cbd5e0" /></TouchableOpacity>
                            </View>

                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                                <View style={[styles.section, { flexDirection: 'row', gap: 16 }]}>
                                    {[ { label: 'Today', key: 'happeningTodayOnly' }, { label: 'Favorites', key: 'favoritesOnly' } ].map(({ label, key }) => (
                                        <View key={key} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f8fafc', padding: 12, borderRadius: 12 }}>
                                            <Text style={{ fontWeight: '600', color: '#475569' }}>{label}</Text>
                                            <Switch value={Boolean(localFilter[key as keyof GameFilter])} onValueChange={(val) => setLocalFilter({...localFilter, [key]: val})} trackColor={{ false: "#e2e8f0", true: COLORS.primary }} />
                                        </View>
                                    ))}
                                </View>

                                <FilterSection title="Distance Range" value={`${Math.round(localFilter.maxDistance)} miles`}>
                                    <Slider style={[styles.sliderTrack, { width: '100%' }]} minimumValue={1} maximumValue={50} step={1} value={localFilter.maxDistance} onValueChange={(val) => setLocalFilter({ ...localFilter, maxDistance: val })} minimumTrackTintColor={COLORS.primary} maximumTrackTintColor="#e2e8f0" thumbTintColor={COLORS.primary} />
                                </FilterSection>

                                <FilterSection title="Sports">
                                    {sports.map(s => <FilterChip key={s.id} label={s.name} isActive={Boolean(localFilter.sportIds?.includes(s.id))} onPress={() => toggle('sportIds', s.id)} />)}
                                </FilterSection>

                                <FilterSection title="Skill Level">
                                    {Object.values(SkillLevel).map(l => <FilterChip key={l} label={l} isActive={Boolean(localFilter.skillLevels?.includes(l))} onPress={() => toggle('skillLevels', l)} />)}
                                </FilterSection>

                                <FilterSection title="Gender Preference">
                                    {Object.values(GenderPreference).map(p => <FilterChip key={p} label={p} isActive={Boolean(localFilter.genderPreferences?.includes(p))} onPress={() => toggle('genderPreferences', p)} />)}
                                </FilterSection>
                            </ScrollView>

                            <View style={styles.footerContainer}>
                                <TouchableOpacity style={styles.clearButton} onPress={handleClear}><Text style={styles.clearButtonText}>Clear All</Text></TouchableOpacity>
                                <TouchableOpacity style={styles.applyButton} onPress={handleApply}><Text style={styles.applyButtonText}>Apply Filters</Text></TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}