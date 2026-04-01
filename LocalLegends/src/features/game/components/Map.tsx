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

const INITIAL_REGION = {
    latitude: 40.2338,
    longitude: -111.6585,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

export default function Map() {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [games, setGames] = useState<GameWithDetails[]>([]);
    const filter: GameFilter = {
        latitude: location?.coords.latitude || 0,
        longitude: location?.coords.longitude || 0,
        maxDistance: 10,
    };

    useEffect(() => {
        (async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied');
                    setLoading(false);
                    return;
                }

                let currentLocation = await Location.getCurrentPositionAsync({});
                setLocation(currentLocation);
            } catch (err) {
                console.error("Error getting location:", err);
                setErrorMsg('Could not fetch location.');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    useEffect(() => {
        setLoading(true);
        (async () => {
            try {
                const games = await GameApi.getGames({ filter });
                setGames(games.games);
            } catch (err) {
                console.error("Error getting games:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, [location]);

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

