import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Switch } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { COLORS } from '@/src/themes/themes';
import { GameApi } from '../api/GameApi';
import { GameStatus, SkillLevel, GenderPreference, AccessType } from '@/src/models/Game';
import { CreateGameFormStyles as styles } from './themes/CreateGameFormStyles';
import Sport from '@/src/models/Sport';
import { validateGameCreation } from './utils/GameCreationValidator';
import GooglePlacesInput from './utils/GooglePlacesInput';
import { parseGoogleAddress } from './utils/GoogleAddressParser';
import { FormSectionHeader } from './form/FormSectionHeader';
import { PlayerTicker } from './form/PlayerTicker';
import { FormToggle } from './form/FormToggle';
import { ChipSelector } from './form/ChipSelector';
import { DateTimePickerModal } from './form/DateTimePickerModal';

export default function CreateGameForm() {
    const [sportId, setSportId] = useState<string>('');
    const [googlePlaceId, setGooglePlaceId] = useState<string>('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [country, setCountry] = useState('USA');
    const [latitude, setLatitude] = useState(40.2338);
    const [longitude, setLongitude] = useState(-111.6585);
    const [locationName, setLocationName] = useState('');
    const [locationDescription, setLocationDescription] = useState('');
    const [maxPlayers, setMaxPlayers] = useState(10);
    const [minPlayers, setMinPlayers] = useState(2);
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date(Date.now() + 3600000));
    const [isRecurring, setIsRecurring] = useState(false);
    const [skillLevel, setSkillLevel] = useState(SkillLevel.All);
    const [genderPreference, setGenderPreference] = useState(GenderPreference.NoPreference);
    const [accessType, setAccessType] = useState(AccessType.Public);
    const [activePickerType, setActivePickerType] = useState<'start' | 'end' | null>(null);
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
        setLocationDescription(parsed.locationDescription);
    };

    const handleConfirmStartTime = (date: Date) => {
        setStartTime(date);
        
        // Automatically shift end time to the same day
        const newEndTime = new Date(endTime);
        newEndTime.setFullYear(date.getFullYear());
        newEndTime.setMonth(date.getMonth());
        newEndTime.setDate(date.getDate());
        
        // If the new end time is before the start time, bump it by 1 hour
        if (newEndTime <= date) {
            newEndTime.setHours(date.getHours() + 1);
        }
        
        setEndTime(newEndTime);
    };

    const handleConfirmEndTime = (date: Date) => {
        // Ensure end time stays on the same day as start time
        const newEndTime = new Date(startTime);
        newEndTime.setHours(date.getHours());
        newEndTime.setMinutes(date.getMinutes());
        newEndTime.setSeconds(0);
        
        setEndTime(newEndTime);
    };

    const handleCreateGame = async () => {
        setError('');
        const validationError = validateGameCreation(
            name, sportId, locationName, locationDescription, streetAddress,
            city, state, zipCode, country, latitude, longitude,
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
                streetAddress, city, state, zipCode, country, latitude, longitude,
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

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}
        >
            <FormSectionHeader title="General Info" icon="information-circle-outline" />
            <Text style={styles.label}>Game Name</Text>
            <TextInput style={styles.input} placeholder="e.g. Saturday Soccer" value={name} onChangeText={setName} />

            <ChipSelector label="Sport" data={sports} selectedValue={sportId} onSelect={setSportId} labelExtractor={(i) => i.name} valueExtractor={(i) => i.id} />

            <Text style={styles.label}>Description</Text>
            <TextInput style={[styles.input, { height: 80 }]} multiline placeholder="What's the vibe?" value={description} onChangeText={setDescription} />

            <FormSectionHeader title="Location Search" icon="search-outline" />
            <GooglePlacesInput onLocationSelected={handleLocationSelected} />

            {streetAddress ? (
                <View style={{ backgroundColor: '#f0f9ff', padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#bae6fd' }}>
                    <Text style={[styles.label, { color: COLORS.primary, marginBottom: 4 }]}>Selected Venue</Text>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1e3a8a' }}>{locationName}</Text>
                    <Text style={{ fontSize: 14, color: '#3b82f6' }}>{streetAddress}, {city}, {state} {zipCode}</Text>
                </View>
            ) : null}

            <FormSectionHeader title="Rules & Players" icon="people-outline" />
            <PlayerTicker label="Max Players" value={maxPlayers} onValueChange={(val) => { setMaxPlayers(val); if (val < minPlayers) setMinPlayers(val); }} />
            <PlayerTicker label="Min Players" value={minPlayers} onValueChange={setMinPlayers} max={maxPlayers} />

            <ChipSelector label="Skill Level" data={Object.values(SkillLevel)} selectedValue={skillLevel} onSelect={setSkillLevel} />

            <FormToggle title="Weekly Game?" description="Others can subscribe to this slot" value={isRecurring} onValueChange={setIsRecurring} />

            <ChipSelector label="Gender Preference" data={Object.values(GenderPreference)} selectedValue={genderPreference} onSelect={setGenderPreference} />

            <FormToggle title="Requires a key?" description="Does this place require a key to get in? (e.g. a church building)" value={accessType === AccessType.Private} onValueChange={(val) => setAccessType(val ? AccessType.Private : AccessType.Public)} />

            <FormSectionHeader title="Time & Date" icon="time-outline" />
            <TouchableOpacity 
                style={styles.dateRow} 
                onPress={() => {
                    console.log("Opening Start Time Picker");
                    setActivePickerType('start');
                }}
            >
                <Text style={styles.dateLabel}>Start Time</Text>
                <Text style={styles.dateValue}>
                    {startTime.toLocaleDateString([], { month: 'short', day: 'numeric' })} at {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.dateRow} 
                onPress={() => {
                    console.log("Opening End Time Picker");
                    setActivePickerType('end');
                }}
            >
                <Text style={styles.dateLabel}>End Time</Text>
                <Text style={styles.dateValue}>
                    {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </TouchableOpacity>

            <DateTimePickerModal 
                visible={activePickerType !== null} 
                onClose={() => setActivePickerType(null)} 
                onConfirm={activePickerType === 'start' ? handleConfirmStartTime : handleConfirmEndTime} 
                value={activePickerType === 'start' ? startTime : endTime} 
                mode={activePickerType === 'start' ? 'datetime' : 'time'} 
                title={activePickerType === 'start' ? "Select Start Time" : "Select End Time"} 
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} onPress={handleCreateGame} disabled={isSubmitting}>
                {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Create Game</Text>}
            </TouchableOpacity>
        </ScrollView>
    );
}