import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { COLORS } from '@/src/themes/themes';

type GooglePlacesInputProps = {
    onLocationSelected: (data: any, details: any) => void;
    placeholder?: string;
};

const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_AI;

export default function GooglePlacesInput({ onLocationSelected, placeholder = "Search for a park or gym..." }: GooglePlacesInputProps) {
    if (!GOOGLE_PLACES_API_KEY) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Google Places API Key Missing</Text>
            </View>
        );
    }

    return (
        <GooglePlacesAutocomplete
            placeholder={placeholder}
            onPress={onLocationSelected}
            fetchDetails={true}
            query={{
                key: GOOGLE_PLACES_API_KEY,
                language: 'en',
                types: 'establishment|geocode', // Search for businesses and addresses
            }}
            styles={{
                container: {
                    flex: 0,
                    width: '100%',
                    marginBottom: 16,
                },
                textInput: {
                    height: 52,
                    color: '#1a202c',
                    fontSize: 16,
                    backgroundColor: '#f7fafc',
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    borderWidth: 1,
                    borderColor: '#edf2f7',
                },
                listView: {
                    backgroundColor: '#FFF',
                    borderRadius: 12,
                    elevation: 5,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                    position: 'absolute',
                    top: 52,
                    zIndex: 1000,
                    width: '100%',
                },
                row: {
                    padding: 13,
                    height: 50,
                    flexDirection: 'row',
                },
                separator: {
                    height: 1,
                    backgroundColor: '#edf2f7',
                },
            }}
            enablePoweredByContainer={false}
            nearbyPlacesAPI="GooglePlacesSearch"
            debounce={200}
            disableScroll={true}
        />
    );
}

const styles = StyleSheet.create({
    errorContainer: {
        padding: 16,
        backgroundColor: '#fff5f5',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#feb2b2',
        marginBottom: 16,
    },
    errorText: {
        color: '#c53030',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
