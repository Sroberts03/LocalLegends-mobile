import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { COLORS } from '@/src/themes/themes';
import { Ionicons } from '@expo/vector-icons';
import { GameFilter, GameWithDetails } from '@/src/models/Game';
import { GameApi } from '../api/GameApi';
import { getSportIcon } from './utils/MapUtil';
import { MapThemes } from './themes/MapThemes';

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

export default function Map({ 
    games, 
    filter, 
    setGames, 
    loading, 
    setLoading, 
    errorMsg,
    location,
    INITIAL_REGION,
 }: MapProps) {

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
                style={MapThemes.map}
                initialRegion={userRegion}
                showsUserLocation={true}
                showsPointsOfInterest={false}
            >
                {games.map((game) => (
                    <Marker
                        key={game.game.id}
                        coordinate={{
                            latitude: game.latitude,
                            longitude: game.longitude,
                        }}
                        title={game.game.name}
                        description={game.game.description}
                    >
                        <View style={MapThemes.markerContainer}>
                            <View style={MapThemes.markerBadge}>
                                <Ionicons name={getSportIcon(game.sportName)} size={20} color="#fff" />
                            </View>
                            <View style={MapThemes.markerTail} />
                        </View>
                    </Marker>
                ))}
            </MapView>

            {errorMsg && (
                <View style={MapThemes.errorBadge}>
                    <Text style={MapThemes.errorText}>{errorMsg}</Text>
                </View>
            )}
        </View>
    );
}

