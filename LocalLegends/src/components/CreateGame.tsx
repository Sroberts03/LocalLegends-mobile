import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import Constants from 'expo-constants';
import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePicker, { DateTimePickerChangeEvent } from '@react-native-community/datetimepicker';
import { GameCreation, GameStatus, GenderPreference, SkillLevel } from '@/src/models/Game';
import Sport from '@/src/models/Sport';

type CreateGameProps = {
  visible: boolean;
  onClose: () => void;
  sports: Sport[];
  handleGameCreation: (gameCreation: GameCreation) => void;
  existingGame?: GameCreation;
};

type PlacePrediction = {
  description: string;
  place_id: string;
};

type PlaceDetails = {
  place_id?: string;
  name?: string;
  formatted_address?: string;
  geometry?: {
    location?: {
      lat?: number;
      lng?: number;
    };
  };
  address_components?: {
    long_name: string;
    short_name: string;
    types: string[];
  }[];
};

const GOOGLE_PLACES_API_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY ||
  process.env.EXPO_PUBLIC_GOOGLE_API_KEY ||
  (Constants.expoConfig?.extra?.googlePlacesApiKey as string | undefined) ||
  '';

const getAddressComponent = (
  components: PlaceDetails['address_components'],
  type: string,
  useShortName = false
): string => {
  const match = components?.find((component) => component.types.includes(type));
  if (!match) return '';
  return useShortName ? match.short_name : match.long_name;
};

export default function CreateGame({ visible, onClose, sports, handleGameCreation, existingGame }: CreateGameProps) {
  // 1. Initial State Declarations
  const [gameId, setGameId] = useState<number>(0);
  const [sportId, setSportId] = useState<number>(0);
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [, setIsSearchingPlaces] = useState<boolean>(false);
  const [, setIsFetchingPlaceDetails] = useState<boolean>(false);
  const [, setPlacesError] = useState<string | null>(null);
  const [googlePlaceId, setGooglePlaceId] = useState<string>('');
  const [gameName, setGameName] = useState<string>('');
  const [gameDescription, setGameDescription] = useState<string>('');
  const [streetAddress, setStreetAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [locationName, setLocationName] = useState<string>('');
  const [locationDescription, setLocationDescription] = useState<string>('');
  const [maxPlayers, setMaxPlayers] = useState<number>(10);
  const [minPlayers, setMinPlayers] = useState<number>(2);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date(Date.now() + 60 * 60 * 1000));
  const [showStartPicker, setShowStartPicker] = useState<boolean>(false);
  const [showEndPicker, setShowEndPicker] = useState<boolean>(false);
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [skillLevel, setSkillLevel] = useState<SkillLevel>(SkillLevel.Beginner);
  const [genderPreference, setGenderPreference] = useState<GenderPreference>(GenderPreference.NoPreference);
  const skipStreetAutocomplete = useRef<boolean>(false);

  // 2. Sync Props to State whenever existingGame or visible changes
  useEffect(() => {
    if (visible && existingGame) {
      setGameId(existingGame.id || 0);
      setSportId(existingGame.sportId || 0);
      setGooglePlaceId(existingGame.googlePlaceId || '');
      setGameName(existingGame.gameName || '');
      setGameDescription(existingGame.gameDescription || '');
      setGooglePlaceId(existingGame.googlePlaceId || '');
      setStreetAddress(existingGame.streetAddress || '');
      setCity(existingGame.city || '');
      setState(existingGame.state || '');
      setZipCode(existingGame.zipCode || '');
      setCountry(existingGame.country || '');
      setLatitude(existingGame.latitude || 0);
      setLongitude(existingGame.longitude || 0);
      setLocationName(existingGame.locationName || '');
      setLocationDescription(existingGame.locationDescription || '');
      setMaxPlayers(existingGame.maxPlayers || 10);
      setMinPlayers(existingGame.minPlayers || 2);
      setStartTime(existingGame.startTime ? new Date(existingGame.startTime) : new Date());
      setEndTime(existingGame.endTime ? new Date(existingGame.endTime) : new Date(Date.now() + 60 * 60 * 1000));
      setIsRecurring(existingGame.isRecurring || false);
      setSkillLevel(existingGame.skillLevel || SkillLevel.Beginner);
      setGenderPreference(existingGame.genderPreference || GenderPreference.NoPreference);
    } else if (visible && !existingGame) {
      resetForm();
    }
  }, [existingGame, visible]);

  const skillOptions = useMemo(() => Object.values(SkillLevel), []);
  const genderOptions = useMemo(() => Object.values(GenderPreference), []);

  // Places Autocomplete Effect
  useEffect(() => {
    if (!visible) {
      setPredictions([]);
      setPlacesError(null);
      return;
    }
    if (skipStreetAutocomplete.current) {
      skipStreetAutocomplete.current = false;
      return;
    }
    const query = streetAddress.trim();
    if (!GOOGLE_PLACES_API_KEY || query.length < 3) {
      setPredictions([]);
      setPlacesError(null);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setIsSearchingPlaces(true);
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
            query
          )}&types=establishment|geocode&key=${GOOGLE_PLACES_API_KEY}`,
          { signal: controller.signal }
        );
        const data = await response.json();
        setPredictions(data.predictions ?? []);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') setPredictions([]);
      } finally {
        setIsSearchingPlaces(false);
      }
    }, 350);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [streetAddress, visible]);

  const handlePlaceSelection = async (prediction: PlacePrediction) => {
    try {
      setIsFetchingPlaceDetails(true);
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
          prediction.place_id
        )}&fields=place_id,name,formatted_address,geometry,address_component&key=${GOOGLE_PLACES_API_KEY}`
      );
      const data = await response.json();
      const result = data.result;
      const streetNumber = getAddressComponent(result.address_components, 'street_number');
      const route = getAddressComponent(result.address_components, 'route');
      
      setGooglePlaceId(result.place_id || prediction.place_id);
      setLocationName(result.name || prediction.description.split(',')[0] || '');
      skipStreetAutocomplete.current = true;
      setStreetAddress([streetNumber, route].filter(Boolean).join(' ') || result.formatted_address?.split(',')[0] || '');
      setCity(getAddressComponent(result.address_components, 'locality'));
      setState(getAddressComponent(result.address_components, 'administrative_area_level_1', true));
      setZipCode(getAddressComponent(result.address_components, 'postal_code'));
      setCountry(getAddressComponent(result.address_components, 'country'));
      setLatitude(result.geometry?.location?.lat ?? 0);
      setLongitude(result.geometry?.location?.lng ?? 0);
      setPredictions([]);
    } catch (error) {
      console.error('Error fetching place details:', error);
      setPlacesError('Could not load place details.');
    } finally {
      setIsFetchingPlaceDetails(false);
    }
  };

  const onStartValueChange = (_event: DateTimePickerChangeEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowStartPicker(false);
    if (selectedDate) {
      setStartTime(selectedDate);
      if (selectedDate >= endTime) {
        setEndTime(new Date(selectedDate.getTime() + 60 * 60 * 1000));
      }
    }
  };

  const onEndValueChange = (_event: DateTimePickerChangeEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowEndPicker(false);
    if (selectedDate) setEndTime(selectedDate);
  };

  const resetForm = () => {
    setGameId(0);
    setSportId(0);
    setGameName('');
    setGameDescription('');
    setStreetAddress('');
    setCity('');
    setState('');
    setZipCode('');
    setCountry('');
    setLatitude(0);
    setLongitude(0);
    setLocationName('');
    setLocationDescription('');
    setMaxPlayers(10);
    setMinPlayers(2);
    setStartTime(new Date());
    setEndTime(new Date(Date.now() + 60 * 60 * 1000));
    setSkillLevel(SkillLevel.Beginner);
    setGenderPreference(GenderPreference.NoPreference);
    setIsRecurring(false);
    setGooglePlaceId('');
  };

  const buildPayload = (status: GameStatus): GameCreation => ({
    id: gameId,
    sportId,
    googlePlaceId: googlePlaceId.trim(),
    gameName: gameName.trim(),
    gameDescription: gameDescription.trim() || undefined,
    streetAddress: streetAddress.trim(),
    city: city.trim(),
    state: state.trim(),
    zipCode: zipCode.trim(),
    country: country.trim(),
    latitude,
    longitude,
    locationName: locationName.trim(),
    locationDescription: locationDescription.trim(),
    maxPlayers,
    minPlayers,
    startTime,
    endTime,
    status,
    isRecurring,
    skillLevel,
    genderPreference,
  });

  const handleCreate = () => {
    if (!gameName.trim() || sportId <= 0 || !googlePlaceId.trim()) {
      Alert.alert('Missing Info', 'Please fill out all required fields marked with *');
      return;
    }
    handleGameCreation(buildPayload(GameStatus.Active));
    onClose();
  };

  const handleSaveDraft = () => {
    handleGameCreation(buildPayload(GameStatus.Draft));
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropTapTarget} onPress={onClose} />
        <View style={styles.sheet}>
          <Pressable style={styles.closeButton} onPress={onClose} hitSlop={10}>
            <Ionicons name="close" size={24} color="#334155" />
          </Pressable>

          <Text style={styles.title}>{existingGame ? 'Edit Game' : 'Create Game'}</Text>
          <Text style={styles.requiredLegend}>* Required</Text>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formContent}>
            <Field label="Game Name *" value={gameName} onChangeText={setGameName} placeholder="Saturday Morning Soccer" />
            
            <Text style={styles.sectionLabel}>Sport *</Text>
            <View style={styles.rowWrap}>
              {sports.map((sport) => (
                <Pressable
                  key={sport.id}
                  style={[styles.chip, sportId === sport.id && styles.chipSelected]}
                  onPress={() => setSportId(sport.id)}
                >
                  <Text style={[styles.chipText, sportId === sport.id && styles.chipTextSelected]}>{sport.name}</Text>
                </Pressable>
              ))}
            </View>

            <Field label="Description" value={gameDescription} onChangeText={setGameDescription} placeholder="Optional details" multiline />

            <Text style={styles.sectionLabel}>Location</Text>
            <Field label="Street Address *" value={streetAddress} onChangeText={setStreetAddress} placeholder="Start typing address" />
            
            {predictions.length > 0 && (
              <View style={styles.predictionList}>
                {predictions.map((p) => (
                  <Pressable key={p.place_id} style={styles.predictionItem} onPress={() => handlePlaceSelection(p)}>
                    <Text style={styles.predictionText}>{p.description}</Text>
                  </Pressable>
                ))}
              </View>
            )}

            <Field label="City *" value={city} onChangeText={setCity} placeholder="Auto-filled" editable={false} />
            <Field label="State *" value={state} onChangeText={setState} placeholder="Auto-filled" editable={false} />
            <Field label="Zip *" value={zipCode} onChangeText={setZipCode} placeholder="Auto-filled" editable={false} />
            <Field label="Location Name *" value={locationName} onChangeText={setLocationName} placeholder="Auto-filled" editable={false} />

            <View style={styles.row}>
              <View style={styles.rowHalf}>
                <Field label="Min Players *" value={String(minPlayers)} onChangeText={(v) => setMinPlayers(Number(v) || 0)} keyboardType="number-pad" />
              </View>
              <View style={styles.rowHalf}>
                <Field label="Max Players *" value={String(maxPlayers)} onChangeText={(v) => setMaxPlayers(Number(v) || 0)} keyboardType="number-pad" />
              </View>
            </View>

            <Text style={styles.fieldLabel}>Start Time *</Text>
            <Pressable style={styles.dateInputButton} onPress={() => setShowStartPicker(true)}>
              <Text style={styles.dateInputText}>{startTime.toLocaleString()}</Text>
              <Ionicons name="calendar-outline" size={18} color="#475569" />
            </Pressable>
            {showStartPicker && (
              <DateTimePicker value={startTime} mode="datetime" display={Platform.OS === 'ios' ? 'inline' : 'default'} onChange={onStartValueChange} />
            )}

            <Text style={styles.fieldLabel}>End Time *</Text>
            <Pressable style={styles.dateInputButton} onPress={() => setShowEndPicker(true)}>
              <Text style={styles.dateInputText}>{endTime.toLocaleString()}</Text>
              <Ionicons name="calendar-outline" size={18} color="#475569" />
            </Pressable>
            {showEndPicker && (
              <DateTimePicker value={endTime} mode="datetime" display={Platform.OS === 'ios' ? 'inline' : 'default'} onChange={onEndValueChange} minimumDate={startTime} />
            )}

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Recurring game *</Text>
              <Switch value={isRecurring} onValueChange={setIsRecurring} />
            </View>

            <Text style={styles.choiceLabel}>Skill Level *</Text>
            <ChoiceGroup options={skillOptions} value={skillLevel} onChange={setSkillLevel} />

            <Text style={styles.choiceLabel}>Gender Preference *</Text>
            <ChoiceGroup options={genderOptions} value={genderPreference} onChange={setGenderPreference} />
          </ScrollView>

          <View style={styles.buttonRow}>
            <Pressable style={styles.secondaryButton} onPress={handleSaveDraft}>
              <Text style={styles.secondaryButtonText}>Save Draft</Text>
            </Pressable>
            <Pressable style={styles.primaryButton} onPress={handleCreate}>
              <Text style={styles.primaryButtonText}>{existingGame ? 'Update Game' : 'Create Game'}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function Field({ label, value, onChangeText, placeholder, keyboardType = 'default', multiline = false, editable = true }: any) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.inputMultiline, !editable && styles.inputDisabled]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        multiline={multiline}
        editable={editable}
      />
    </View>
  );
}

function ChoiceGroup({ options, value, onChange }: any) {
  return (
    <View style={styles.choiceWrap}>
      {options.map((opt: string) => (
        <Pressable key={opt} style={[styles.choiceChip, value === opt && styles.choiceChipSelected]} onPress={() => onChange(opt)}>
          <Text style={[styles.choiceChipText, value === opt && styles.choiceChipTextSelected]}>{opt}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  backdropTapTarget: { flex: 1 },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '90%' },
  closeButton: { position: 'absolute', top: 20, right: 20, zIndex: 10 },
  title: { fontSize: 22, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
  requiredLegend: { color: '#64748b', fontSize: 12, marginBottom: 12 },
  formContent: { paddingBottom: 20 },
  sectionLabel: { fontSize: 14, fontWeight: '700', color: '#334155', marginTop: 10, marginBottom: 8 },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  chip: { borderWidth: 1, borderColor: '#cbd5e1', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f8fafc' },
  chipSelected: { backgroundColor: '#6366f1', borderColor: '#6366f1' },
  chipText: { color: '#475569', fontWeight: '600' },
  chipTextSelected: { color: '#fff' },
  fieldWrap: { marginBottom: 12 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, padding: 12, fontSize: 16, color: '#0f172a', backgroundColor: '#f8fafc' },
  inputMultiline: { minHeight: 80, textAlignVertical: 'top' },
  inputDisabled: { backgroundColor: '#f1f5f9', color: '#94a3b8' },
  dateInputButton: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, padding: 12, backgroundColor: '#f8fafc', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  dateInputText: { fontSize: 16, color: '#0f172a' },
  predictionList: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, marginTop: -8, marginBottom: 12, backgroundColor: '#fff', overflow: 'hidden' },
  predictionItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  predictionText: { fontSize: 14, color: '#334155' },
  row: { flexDirection: 'row', gap: 12 },
  rowHalf: { flex: 1 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  switchLabel: { fontSize: 14, fontWeight: '600', color: '#0f172a' },
  choiceLabel: { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8 },
  choiceWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  choiceChip: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#f8fafc' },
  choiceChipSelected: { backgroundColor: '#6366f1', borderColor: '#6366f1' },
  choiceChipText: { color: '#475569', fontWeight: '600', textTransform: 'capitalize' },
  choiceChipTextSelected: { color: '#fff' },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 10 },
  secondaryButton: { flex: 1, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#cbd5e1', alignItems: 'center' },
  primaryButton: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: '#6366f1', alignItems: 'center' },
  secondaryButtonText: { color: '#475569', fontWeight: '700' },
  primaryButtonText: { color: '#fff', fontWeight: '700' },
});