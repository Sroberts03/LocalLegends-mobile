import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { COLORS } from '@/src/themes/themes';
import { Ionicons } from '@expo/vector-icons';
import { GameApi } from '../api/GameApi';
import { GameStatus, SkillLevel, GenderPreference, AccessType } from '@/src/models/Game';
import { CreateGameFormStyles as styles } from './themes/CreateGameFormStyles';
import Sport from '@/src/models/Sport';
import { validateGameCreation } from './utils/GameCreationValidator';
import GooglePlacesInput from './utils/GooglePlacesInput';
import { parseGoogleAddress } from './utils/GoogleAddressParser';

export default function CreateGameForm() {
    const [sportId, setSportId] = useState<string>('');
    const [googlePlaceId, setGooglePlaceId] = useState<string>('manual_entry');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [country, setCountry] = useState('USA');
    const [latitude, setLatitude] = useState(40.2338); // Default to Provo
    const [longitude, setLongitude] = useState(-111.6585);
    const [locationName, setLocationName] = useState('');
    const [locationDescription, setLocationDescription] = useState('');
    const [maxPlayers, setMaxPlayers] = useState(10);
    const [minPlayers, setMinPlayers] = useState(2);
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date(Date.now() + 3600000)); // Default +1 hour
    const [isRecurring, setIsRecurring] = useState(false);
    const [skillLevel, setSkillLevel] = useState(SkillLevel.All);
    const [genderPreference, setGenderPreference] = useState(GenderPreference.NoPreference);
    const [accessType, setAccessType] = useState(AccessType.Public);
    
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sports, setSports] = useState<Sport[]>([]);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchSports = async () => {
            try {
                const response = await GameApi.getSports();
                setSports(response.sports);
            } catch (err) {
                console.error("Failed to fetch sports", err);
            }
        }
        fetchSports();
    }, []);

    const handleLocationSelected = (data: any, details: any) => {
        const parsed = parseGoogleAddress(data, details);
        
        setStreetAddress(parsed.streetAddress);
        setCity(parsed.city);
        setState(parsed.state);
        setZipCode(parsed.zipCode);
        setCountry(parsed.country);
        setLatitude(parsed.latitude);
        setLongitude(parsed.longitude);
        setLocationName(parsed.locationName);
        setGooglePlaceId(parsed.googlePlaceId);
    };

    const handleCreateGame = async () => {
        setError('');
        const validationError = validateGameCreation(
            name, sportId, locationName, locationDescription, streetAddress, 
            city, state, zipCode, country, latitude || 0, longitude || 0, 
            maxPlayers, minPlayers, startTime, endTime, isRecurring, 
            skillLevel, genderPreference, accessType
        );

        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setIsSubmitting(true);
            await GameApi.createGame({
                sportId, googlePlaceId, gameName: name, gameDescription: description,
                streetAddress, city, state, zipCode, country, latitude: latitude || 0, longitude: longitude || 0,
                locationName, locationDescription, maxPlayers, minPlayers,
                startTime, endTime, isRecurring, skillLevel, genderPreference, accessType
            });
            Alert.alert("Success", "Game created successfully!");
        } catch (err: any) {
            setError(err.message || "Failed to create game");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderSectionHeader = (title: string, icon: any) => (
        <View style={styles.sectionHeader}>
            <Ionicons name={icon} size={16} color={COLORS.primary} style={{ marginRight: 8 }} />
            <Text style={styles.sectionTitle}>{title}</Text>
        </View>
    );

    return (
        <ScrollView 
            style={styles.container} 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={{ paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}
        >
            {renderSectionHeader("General Info", "information-circle-outline")}
            <Text style={styles.label}>Game Name</Text>
            <TextInput style={styles.input} placeholder="e.g. Saturday Soccer" value={name} onChangeText={setName} />

            <Text style={styles.label}>Sport</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sportChips}>
                {sports.map((sport) => (
                    <TouchableOpacity key={sport.id} onPress={() => setSportId(sport.id)} style={[styles.sportChip, sportId === sport.id && styles.sportChipActive]}>
                        <Text style={[styles.sportChipText, sportId === sport.id && styles.sportChipTextActive]}>{sport.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <Text style={styles.label}>Description</Text>
            <TextInput style={[styles.input, { height: 80 }]} multiline placeholder="What's the vibe?" value={description} onChangeText={setDescription} />

            {renderSectionHeader("Location Search", "search-outline")}
            <GooglePlacesInput onLocationSelected={handleLocationSelected} />

            {streetAddress ? (
                <View style={{ backgroundColor: '#f0f9ff', padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#bae6fd' }}>
                    <Text style={[styles.label, { color: COLORS.primary, marginBottom: 4 }]}>Selected Venue</Text>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1e3a8a' }}>{locationName}</Text>
                    <Text style={{ fontSize: 14, color: '#3b82f6' }}>{streetAddress}, {city}, {state} {zipCode}</Text>
                </View>
            ) : null}

            {renderSectionHeader("Rules & Players", "people-outline")}
            <View style={styles.sliderContainer}>
                <View style={styles.sliderLabelRow}>
                    <Text style={styles.label}>Max Players</Text>
                    <Text style={styles.sliderValue}>{maxPlayers}</Text>
                </View>
                <Slider minimumValue={2} maximumValue={50} step={1} value={maxPlayers} onValueChange={setMaxPlayers} minimumTrackTintColor={COLORS.primary} thumbTintColor={COLORS.primary} />
            </View>

            <Text style={styles.label}>Skill Level</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sportChips}>
                {Object.values(SkillLevel).map((level) => (
                    <TouchableOpacity key={level} onPress={() => setSkillLevel(level)} style={[styles.sportChip, skillLevel === level && styles.sportChipActive]}>
                        <Text style={[styles.sportChipText, skillLevel === level && styles.sportChipTextActive]}>{level}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {renderSectionHeader("Time & Date", "time-outline")}
            <View style={styles.row}>
                <View style={styles.column}>
                    <Text style={styles.label}>Start Time</Text>
                    <TouchableOpacity style={styles.input} onPress={() => setShowStartTimePicker(true)}>
                        <Text>{startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.column}>
                    <Text style={styles.label}>End Time</Text>
                    <TouchableOpacity style={styles.input} onPress={() => setShowEndTimePicker(true)}>
                        <Text>{endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {showStartTimePicker && <DateTimePicker value={startTime} mode="datetime" display="default" onChange={(e, d) => { setShowStartTimePicker(false); if (d) setStartTime(d); }} />}
            {showEndTimePicker && <DateTimePicker value={endTime} mode="time" display="default" onChange={(e, d) => { setShowEndTimePicker(false); if (d) setEndTime(d); }} />}

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} onPress={handleCreateGame} disabled={isSubmitting}>
                {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Create Game</Text>}
            </TouchableOpacity>
        </ScrollView>
    );
}