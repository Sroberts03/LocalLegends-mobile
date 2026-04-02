import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { COLORS } from '@/src/themes/themes';
import { Ionicons } from '@expo/vector-icons';
import { GameFilter, GameWithDetails } from '@/src/models/Game';
import { getSportIcon } from './utils/MapUtil';
import { MapThemes } from './themes/MapThemes';

export interface MapRef {
    refocus: () => void;
}

type MapProps = {
    games: GameWithDetails[];
    filter: GameFilter;
    setGames: (games: GameWithDetails[]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    errorMsg: string | null;
    setErrorMsg: (errorMsg: string | null) => void;
    location: Location.LocationObject | null;
    setLocation: (location: Location.LocationObject | null) => void;
    INITIAL_REGION: {
        latitude: number;
        longitude: number;
        latitudeDelta: number;
        longitudeDelta: number;
    };
}

// 1. The new wrapper component to handle the Android rendering bug
const CustomMarker = ({ game, gameLength }: { game: GameWithDetails, gameLength: number }) => {
    const [trackChanges, setTrackChanges] = useState(true);

    useEffect(() => {
        // Give the icon 500ms to load into memory, then lock the snapshot
        const timer = setTimeout(() => setTrackChanges(false), 500);
        return () => clearTimeout(timer);
    }, []);

    // Guard against null coordinates just in case
    if (!game.latitude || !game.longitude) return null;

    return (
        <Marker
            key={`${game.game.id}-${gameLength}`}
            identifier={`${game.game.id}-${gameLength}`}
            coordinate={{
                latitude: Number(game.latitude),
                longitude: Number(game.longitude),
            }}
            title={game.game.name}
            description={game.game.description}
            tracksViewChanges={trackChanges}
        >
            <View style={MapThemes.markerContainer}>
                <View style={MapThemes.markerBadge}>
                    <Ionicons name={getSportIcon(game.sportName)} size={20} color="#fff" />
                </View>
                <View style={MapThemes.markerTail} />
            </View>
        </Marker>
    );
};

// 2. Your main Map component
const Map = forwardRef<MapRef, MapProps>(({
    games,
    loading,
    errorMsg,
    location,
    INITIAL_REGION,
}, ref) => {
    const mapRef = useRef<MapView>(null);

    useImperativeHandle(ref, () => ({
        refocus: () => {
            if (mapRef.current && location) {
                mapRef.current.animateToRegion({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.015,
                }, 1000);
            }
        },
    }));

    const userRegion = location ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    } : INITIAL_REGION;

    if (loading) {
        return (
            <View style={MapThemes.centerContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={MapThemes.loadingText}>Initializing Map...</Text>
            </View>
        );
    }

    return (
        <View style={MapThemes.container}>
            <MapView
                ref={mapRef}
                style={MapThemes.map}
                initialRegion={userRegion}
                showsUserLocation={true}
                showsPointsOfInterest={false}
            >
                {/* 3. Using the new CustomMarker component here */}
                {games.map((game) => (
                    <CustomMarker key={game.game.id} game={game} gameLength={games.length} />
                ))}
            </MapView>

            {errorMsg && (
                <View style={MapThemes.errorBadge}>
                    <Text style={MapThemes.errorText}>{errorMsg}</Text>
                </View>
            )}
        </View>
    );
});

export default Map;