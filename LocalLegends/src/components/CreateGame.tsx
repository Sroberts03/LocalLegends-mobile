import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
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

export default function CreateGame({ visible, onClose, sports, handleGameCreation }: CreateGameProps) {
  const getDefaultEndTime = () => new Date(Date.now() + 60 * 60 * 1000);

  const [sportId, setSportId] = useState<number>(0);
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isSearchingPlaces, setIsSearchingPlaces] = useState<boolean>(false);
  const [isFetchingPlaceDetails, setIsFetchingPlaceDetails] = useState<boolean>(false);
  const [placesError, setPlacesError] = useState<string | null>(null);
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

  const skillOptions = useMemo(() => Object.values(SkillLevel), []);
  const genderOptions = useMemo(() => Object.values(GenderPreference), []);

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

        if (!response.ok) {
          throw new Error(`Autocomplete request failed (${response.status})`);
        }

        const data = (await response.json()) as {
          status?: string;
          error_message?: string;
          predictions?: PlacePrediction[];
        };

        if (data.status && data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
          throw new Error(data.error_message || `Autocomplete failed (${data.status})`);
        }

        setPredictions(data.predictions ?? []);
        setPlacesError(null);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          setPlacesError('Could not fetch places. Check API key and Places API access.');
          setPredictions([]);
        }
      } finally {
        setIsSearchingPlaces(false);
      }
    }, 350);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [streetAddress, visible]);

  const handleStreetChange = (value: string) => {
    setStreetAddress(value);
    setGooglePlaceId('');
    setLocationName('');
    setCity('');
    setState('');
    setZipCode('');
    setCountry('');
    setLatitude(0);
    setLongitude(0);
    setPlacesError(null);
  };

  const handlePlaceSelection = async (prediction: PlacePrediction) => {
    if (!GOOGLE_PLACES_API_KEY) {
      Alert.alert('Missing API key', 'Set EXPO_PUBLIC_GOOGLE_PLACES_API_KEY to use place lookup.');
      return;
    }

    try {
      setIsFetchingPlaceDetails(true);
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
          prediction.place_id
        )}&fields=place_id,name,formatted_address,geometry,address_component&key=${GOOGLE_PLACES_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Place details request failed (${response.status})`);
      }

      const data = (await response.json()) as {
        status?: string;
        error_message?: string;
        result?: PlaceDetails;
      };

      if (!data.result || (data.status && data.status !== 'OK')) {
        throw new Error(data.error_message || `Place details failed (${data.status || 'unknown'})`);
      }

      const result = data.result;
      const streetNumber = getAddressComponent(result.address_components, 'street_number');
      const route = getAddressComponent(result.address_components, 'route');
      const derivedStreet = [streetNumber, route].filter(Boolean).join(' ').trim();
      const derivedCity =
        getAddressComponent(result.address_components, 'locality') ||
        getAddressComponent(result.address_components, 'sublocality_level_1') ||
        getAddressComponent(result.address_components, 'postal_town');
      const derivedState = getAddressComponent(result.address_components, 'administrative_area_level_1', true);
      const derivedZip = getAddressComponent(result.address_components, 'postal_code');
      const derivedCountry = getAddressComponent(result.address_components, 'country');

      setGooglePlaceId(result.place_id || prediction.place_id);
      setLocationName(result.name || prediction.description.split(',')[0] || '');
      skipStreetAutocomplete.current = true;
      setStreetAddress(derivedStreet || result.formatted_address?.split(',')[0] || '');
      setCity(derivedCity);
      setState(derivedState);
      setZipCode(derivedZip);
      setCountry(derivedCountry);
      setLatitude(result.geometry?.location?.lat ?? 0);
      setLongitude(result.geometry?.location?.lng ?? 0);

      setPredictions([]);
      setPlacesError(null);
    } catch (error) {
      setPlacesError((error as Error).message || 'Could not load place details.');
    } finally {
      setIsFetchingPlaceDetails(false);
    }
  };

  const parseNumber = (value: string): number => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const formatDateTime = (value: Date): string => {
    return value.toLocaleString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const openStartPicker = () => {
    setShowEndPicker(false);
    setShowStartPicker(true);
  };

  const openEndPicker = () => {
    setShowStartPicker(false);
    setShowEndPicker(true);
  };

  const onStartValueChange = (_event: DateTimePickerChangeEvent, selectedDate: Date) => {
    if (Platform.OS === 'android') setShowStartPicker(false);

    setStartTime(selectedDate);
    if (selectedDate >= endTime) {
      setEndTime(new Date(selectedDate.getTime() + 60 * 60 * 1000));
    }
  };

  const onEndValueChange = (_event: DateTimePickerChangeEvent, selectedDate: Date) => {
    if (Platform.OS === 'android') setShowEndPicker(false);
    setEndTime(selectedDate);
  };

  const onStartPickerDismiss = () => setShowStartPicker(false);
  const onEndPickerDismiss = () => setShowEndPicker(false);

  const resetForm = () => {
    setSportId(0);
    setPredictions([]);
    setIsSearchingPlaces(false);
    setIsFetchingPlaceDetails(false);
    setPlacesError(null);
    setGooglePlaceId('');
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
    setEndTime(getDefaultEndTime());
    setShowStartPicker(false);
    setShowEndPicker(false);
    setIsRecurring(false);
    setSkillLevel(SkillLevel.Beginner);
    setGenderPreference(GenderPreference.NoPreference);
    skipStreetAutocomplete.current = false;
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const buildPayload = (status: GameStatus): GameCreation => {
    return {
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
    };
  };

  const handleCreate = () => {
    if (!gameName.trim()) {
      Alert.alert('Missing game name', 'Enter a game name before creating.');
      return;
    }

    if (sportId <= 0) {
      Alert.alert('Missing sport', 'Select a sport before creating.');
      return;
    }

    if (minPlayers > maxPlayers) {
      Alert.alert('Invalid player counts', 'Minimum players cannot be greater than maximum players.');
      return;
    }

    if (!googlePlaceId.trim()) {
      Alert.alert('Missing location', 'Search and choose a place to auto-fill location details.');
      return;
    }

    const payload = buildPayload(GameStatus.Active);

    if (!payload.startTime || !payload.endTime) {
      Alert.alert('Missing date/time', 'Select start and end times for the game.');
      return;
    }

    if (payload.startTime <= new Date()) {
      Alert.alert('Invalid start time', 'Start time must be in the future.');
      return;
    }

    if (payload.endTime <= payload.startTime) {
      Alert.alert('Invalid date range', 'End time must be after start time.');
      return;
    }

    handleClose();
  };

  const handleSaveDraft = () => {
    const payload = buildPayload(GameStatus.Draft);
    handleGameCreation(payload);
    handleClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropTapTarget} onPress={handleClose} />
        <View style={styles.sheet}>
          <Pressable style={styles.closeButton} onPress={handleClose} hitSlop={10}>
            <Ionicons name="close" size={24} color="#334155" />
          </Pressable>

          <Text style={styles.title}>Create Game</Text>
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
            {sports.length === 0 ? <Text style={styles.helperText}>No sports loaded yet.</Text> : null}
            <Field
              label="Description"
              value={gameDescription}
              onChangeText={setGameDescription}
              placeholder="Optional details"
              multiline
            />

            <Text style={styles.sectionLabel}>Location</Text>
            {!GOOGLE_PLACES_API_KEY ? (
              <Text style={styles.helperText}>Missing EXPO_PUBLIC_GOOGLE_PLACES_API_KEY. Place lookup is disabled.</Text>
            ) : null}
            {isSearchingPlaces ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color="#6366f1" />
                <Text style={styles.helperText}>Searching places...</Text>
              </View>
            ) : null}
            {isFetchingPlaceDetails ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color="#6366f1" />
                <Text style={styles.helperText}>Fetching place details...</Text>
              </View>
            ) : null}
            {placesError ? <Text style={styles.errorText}>{placesError}</Text> : null}
            <Field
              label="Street *"
              value={streetAddress}
              onChangeText={handleStreetChange}
              placeholder="Start typing address"
            />
            {predictions.length > 0 ? (
              <View style={styles.predictionList}>
                {predictions.map((prediction) => (
                  <Pressable
                    key={prediction.place_id}
                    style={styles.predictionItem}
                    onPress={() => handlePlaceSelection(prediction)}
                  >
                    <Text style={styles.predictionText}>{prediction.description}</Text>
                  </Pressable>
                ))}
              </View>
            ) : null}

            <Field label="City *" value={city} onChangeText={setCity} placeholder="Auto-filled" editable={false} />
            <Field label="State *" value={state} onChangeText={setState} placeholder="Auto-filled" editable={false} />
            <Field
              label="Zip *"
              value={zipCode}
              onChangeText={setZipCode}
              placeholder="Auto-filled"
              keyboardType="number-pad"
              editable={false}
            />
            <Field label="Country *" value={country} onChangeText={setCountry} placeholder="Auto-filled" editable={false} />
            <Field
              label="Location Name *"
              value={locationName}
              onChangeText={setLocationName}
              placeholder="Auto-filled from place selection"
              editable={false}
            />
            <Field
              label="Location Description"
              value={locationDescription}
              onChangeText={setLocationDescription}
              placeholder="Optional details like court number"
            />
            <Text style={styles.sectionLabel}>Game Settings *</Text>
            <View style={styles.row}>
              <View style={styles.rowHalf}>
                <Field
                  label="Min Players *"
                  value={String(minPlayers)}
                  onChangeText={(value) => setMinPlayers(parseNumber(value))}
                  keyboardType="number-pad"
                />
              </View>
              <View style={styles.rowHalf}>
                <Field
                  label="Max Players *"
                  value={String(maxPlayers)}
                  onChangeText={(value) => setMaxPlayers(parseNumber(value))}
                  keyboardType="number-pad"
                />
              </View>
            </View>
            <Text style={styles.fieldLabel}>Start Time *</Text>
            <Pressable style={styles.dateInputButton} onPress={openStartPicker}>
              <Text style={styles.dateInputText}>{formatDateTime(startTime)}</Text>
              <Ionicons name="calendar-outline" size={18} color="#475569" />
            </Pressable>
            {showStartPicker ? (
              <DateTimePicker
                value={startTime}
                mode="datetime"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onValueChange={onStartValueChange}
                onDismiss={onStartPickerDismiss}
                onNeutralButtonPress={onStartPickerDismiss}
              />
            ) : null}

            <Text style={styles.fieldLabel}>End Time *</Text>
            <Pressable style={styles.dateInputButton} onPress={openEndPicker}>
              <Text style={styles.dateInputText}>{formatDateTime(endTime)}</Text>
              <Ionicons name="calendar-outline" size={18} color="#475569" />
            </Pressable>
            {showEndPicker ? (
              <DateTimePicker
                value={endTime}
                mode="datetime"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onValueChange={onEndValueChange}
                onDismiss={onEndPickerDismiss}
                onNeutralButtonPress={onEndPickerDismiss}
                minimumDate={startTime}
              />
            ) : null}

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Recurring game *</Text>
              <Switch value={isRecurring} onValueChange={setIsRecurring} />
            </View>

            <Text style={styles.choiceLabel}>Skill Level *</Text>
            <ChoiceGroup<SkillLevel> options={skillOptions} value={skillLevel} onChange={setSkillLevel} />

            <Text style={styles.choiceLabel}>Gender Preference *</Text>
            <ChoiceGroup<GenderPreference> options={genderOptions} value={genderPreference} onChange={setGenderPreference} />
          </ScrollView>

          <View style={styles.buttonRow}>
            <Pressable style={styles.secondaryButton} onPress={handleSaveDraft}>
              <Text style={styles.secondaryButtonText}>Save Draft</Text>
            </Pressable>
            <Pressable style={styles.primaryButton} onPress={handleCreate}>
              <Text style={styles.primaryButtonText}>Create Game</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'number-pad' | 'decimal-pad';
  multiline?: boolean;
  editable?: boolean;
};

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  multiline = false,
  editable = true,
}: FieldProps) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.inputMultiline, !editable && styles.inputDisabled]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        keyboardType={keyboardType}
        multiline={multiline}
        editable={editable}
      />
    </View>
  );
}

type ChoiceGroupProps<T extends string> = {
  options: T[];
  value: T;
  onChange: (value: T) => void;
};

function ChoiceGroup<T extends string>({ options, value, onChange }: ChoiceGroupProps<T>) {
  return (
    <View style={styles.choiceWrap}>
      {options.map((option) => {
        const selected = option === value;
        return (
          <Pressable key={option} style={[styles.choiceChip, selected && styles.choiceChipSelected]} onPress={() => onChange(option)}>
            <Text style={[styles.choiceChipText, selected && styles.choiceChipTextSelected]}>{option}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  backdropTapTarget: {
    flex: 1,
  },
  sheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    maxHeight: '92%',
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
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  requiredLegend: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
  },
  formContent: {
    paddingBottom: 18,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginTop: 6,
    marginBottom: 6,
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'flex-start',
    marginBottom: 10,
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
  fieldWrap: {
    marginBottom: 10,
  },
  dateInputButton: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 12,
    minHeight: 46,
    backgroundColor: '#f8fafc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dateInputText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '500',
  },
  fieldLabel: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputDisabled: {
    backgroundColor: '#f1f5f9',
    color: '#64748b',
  },
  helperText: {
    color: '#475569',
    fontSize: 12,
    marginTop: -6,
    marginBottom: 8,
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '600',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  predictionList: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
  },
  predictionItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  predictionText: {
    color: '#1e293b',
    fontSize: 13,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  rowHalf: {
    flex: 1,
  },
  switchRow: {
    marginTop: 6,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    color: '#0f172a',
    fontWeight: '600',
  },
  choiceLabel: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  choiceWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  choiceChip: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f8fafc',
  },
  choiceChipSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#6366f1',
  },
  choiceChipText: {
    color: '#334155',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  choiceChipTextSelected: {
    color: '#ffffff',
  },
  primaryButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonRow: {
    marginTop: 8,
    flexDirection: 'row',
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#334155',
    fontWeight: '700',
    fontSize: 16,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
});