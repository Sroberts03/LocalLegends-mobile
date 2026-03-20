import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { GameFilter, GenderPreference, SkillLevel } from '@/src/models/Game';
import Sport from '@/src/models/Sport';
import Ionicons from '@expo/vector-icons/Ionicons';

type FilterUpdates = Pick<
  GameFilter,
  'sportIds' | 'skillLevels' | 'genderPreferences' | 'favoritesOnly' | 'happeningTodayOnly' | 'maxDistance'
>;

type FilterModalProps = {
  visible: boolean;
  filters: GameFilter;
  onClose: () => void;
  onApply: (updates: FilterUpdates) => void;
  sports: Sport[];
};

const DEFAULT_MAX_DISTANCE = 25;
const MIN_DISTANCE = 1;
const MAX_DISTANCE = 50;

const sanitizeGenderPreferences = (values?: GenderPreference[]): GenderPreference[] =>
  (values ?? []).filter((value) => value !== GenderPreference.NoPreference);

export default function FilterModal({ visible, filters, onClose, onApply, sports }: FilterModalProps) {
  const [sportIds, setSportIds] = useState<number[]>(filters.sportIds ?? []);
  const [skillLevels, setSkillLevels] = useState<SkillLevel[]>(filters.skillLevels ?? []);
  const [genderPreferences, setGenderPreferences] = useState<GenderPreference[]>(sanitizeGenderPreferences(filters.genderPreferences));
  const [favoritesOnly, setFavoritesOnly] = useState<boolean | undefined>(!!filters.favoritesOnly);
  const [happeningTodayOnly, setHappeningTodayOnly] = useState<boolean | undefined>(!!filters.happeningTodayOnly);
  const [maxDistance, setMaxDistance] = useState<number>(filters.maxDistance || DEFAULT_MAX_DISTANCE);  
  
  useEffect(() => {
    if (!visible) return;
    setSportIds(filters.sportIds ?? []);
    setSkillLevels(filters.skillLevels ?? []);
    setGenderPreferences(sanitizeGenderPreferences(filters.genderPreferences));
    setFavoritesOnly(!!filters.favoritesOnly);
    setHappeningTodayOnly(!!filters.happeningTodayOnly);
    setMaxDistance(filters.maxDistance || DEFAULT_MAX_DISTANCE);
  }, [visible, filters]);

  const toggleValue = <T,>(values: T[], value: T): T[] => {
    if (values.includes(value)) {
      return values.filter((v) => v !== value);
    }
    return [...values, value];
  };

  const applyFilters = () => {
    onApply({
      sportIds: sportIds.length > 0 ? sportIds : undefined,
      skillLevels: skillLevels.length > 0 ? skillLevels : undefined,
      genderPreferences: genderPreferences.length > 0 ? genderPreferences : undefined,
      favoritesOnly : !!favoritesOnly,
      happeningTodayOnly: !!happeningTodayOnly,
      maxDistance,
    });
  };

  const clearFilters = () => {
    const defaults: FilterUpdates = {
      sportIds: undefined,
      skillLevels: undefined,
      genderPreferences: undefined,
      favoritesOnly: false,
      happeningTodayOnly: false,
      maxDistance: DEFAULT_MAX_DISTANCE,
    };

    setSportIds([]);
    setSkillLevels([]);
    setGenderPreferences([]);
    setFavoritesOnly(defaults.favoritesOnly);
    setHappeningTodayOnly(defaults.happeningTodayOnly);
    setMaxDistance(defaults.maxDistance);

    onApply(defaults);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Pressable style={styles.closeButton} onPress={onClose} hitSlop={10}>
            <Ionicons name="close" size={24} color="#334155" />
          </Pressable>
          <Text style={styles.title}>Filters</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionLabel}>Sport</Text>
            <View style={styles.rowWrap}>
              <Chip
                label="Any"
                selected={sportIds.length === 0}
                onPress={() => setSportIds([])}
              />
              {sports.map((sport) => (
                <Chip
                  key={sport.id}
                  label={sport.name}
                  selected={sportIds.includes(sport.id)}
                  onPress={() => setSportIds((prev) => toggleValue(prev, sport.id))}
                />
              ))}
            </View>

            <Text style={styles.sectionLabel}>Skill</Text>
            <View style={styles.rowWrap}>
              <Chip
                label="Any"
                selected={skillLevels.length === 0}
                onPress={() => setSkillLevels([])}
              />
              <Chip
                label="Beginner"
                selected={skillLevels.includes(SkillLevel.Beginner)}
                onPress={() => setSkillLevels((prev) => toggleValue(prev, SkillLevel.Beginner))}
              />
              <Chip
                label="Intermediate"
                selected={skillLevels.includes(SkillLevel.Intermediate)}
                onPress={() => setSkillLevels((prev) => toggleValue(prev, SkillLevel.Intermediate))}
              />
              <Chip
                label="Advanced"
                selected={skillLevels.includes(SkillLevel.Advanced)}
                onPress={() => setSkillLevels((prev) => toggleValue(prev, SkillLevel.Advanced))}
              />
            </View>

            <Text style={styles.sectionLabel}>Gender Preference</Text>
            <View style={[styles.rowWrap, styles.genderRowWrap]}>
              <Chip
                label="Any"
                selected={genderPreferences.length === 0}
                onPress={() => setGenderPreferences([])}
              />
              <Chip
                label="Coed"
                selected={genderPreferences.includes(GenderPreference.Coed)}
                onPress={() => setGenderPreferences((prev) => toggleValue(prev, GenderPreference.Coed))}
              />
              <Chip
                label="All Male"
                selected={genderPreferences.includes(GenderPreference.AllMale)}
                onPress={() => setGenderPreferences((prev) => toggleValue(prev, GenderPreference.AllMale))}
              />
              <Chip
                label="All Female"
                selected={genderPreferences.includes(GenderPreference.AllFemale)}
                onPress={() => setGenderPreferences((prev) => toggleValue(prev, GenderPreference.AllFemale))}
              />
            </View>

            <Text style={styles.sectionLabel}>Max Distance (mi)</Text>
            <View style={styles.sliderValueRow}>
              <Text style={styles.sliderValueText}>{maxDistance} mi</Text>
            </View>
            <View style={styles.sliderWrap}>
              <Slider
                minimumValue={MIN_DISTANCE}
                maximumValue={MAX_DISTANCE}
                step={1}
                value={maxDistance}
                onValueChange={setMaxDistance}
                minimumTrackTintColor="#6366f1"
                maximumTrackTintColor="#cbd5e1"
                thumbTintColor="#4f46e5"
              />
              <View style={styles.sliderTicksRow}>
                <Text style={styles.sliderTickText}>{MIN_DISTANCE}</Text>
                <Text style={styles.sliderTickText}>{MAX_DISTANCE}+</Text>
              </View>
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Favorites only</Text>
              <Switch value={favoritesOnly} onValueChange={setFavoritesOnly} />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Happening today only</Text>
              <Switch value={happeningTodayOnly} onValueChange={setHappeningTodayOnly} />
            </View>
          </ScrollView>

          <View style={styles.buttonRow}>
            <Pressable style={styles.secondaryButton} onPress={clearFilters}>
              <Text style={styles.secondaryButtonText}>Clear Filters</Text>
            </Pressable>
            <Pressable style={styles.primaryButton} onPress={applyFilters}>
              <Text style={styles.primaryButtonText}>Apply</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

function Chip({ label, selected, onPress }: ChipProps) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, selected && styles.chipSelected]}>
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '82%',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 22,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 2,
    elevation: 2,
    padding: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginTop: 8,
    marginBottom: 8,
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  genderRowWrap: {
    marginBottom: 4,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  chipSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#6366f1',
  },
  chipText: {
    color: '#334155',
    fontWeight: '600',
  },
  chipTextSelected: {
    color: '#ffffff',
  },
  switchRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    color: '#0f172a',
    fontWeight: '600',
  },
  sliderWrap: {
    marginBottom: 8,
    marginTop: -2,
  },
  sliderTicksRow: {
    marginTop: -2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderTickText: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '700',
  },
  sliderValueRow: {
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  sliderValueText: {
    color: '#1e293b',
    fontWeight: '700',
  },
  buttonRow: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#334155',
    fontWeight: '700',
  },
  primaryButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
