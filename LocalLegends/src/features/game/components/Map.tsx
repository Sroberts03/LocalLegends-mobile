import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { COLORS } from '@/src/themes/themes';
import { Ionicons } from '@expo/vector-icons';
import { GameFilter, GameWithDetails } from '@/src/models/Game';
import { getSportIcon } from '../../common/SportIcon';
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
    onGamePress?: (game: GameWithDetails) => void;
    onMapLongPress?: (coord: { latitude: number, longitude: number }) => void;
    longPressCoord?: { latitude: number, longitude: number } | null;
}

// 1. The wrapper component with jitter logic
const CustomMarker = ({
    game,
    gameLength,
    onGamePress,
    indexInGroup = 0,
    totalInGroup = 1
}: {
    game: GameWithDetails,
    gameLength: number,
    onGamePress?: (game: GameWithDetails) => void,
    indexInGroup?: number,
    totalInGroup?: number
}) => {
    const [trackChanges, setTrackChanges] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setTrackChanges(false), 500);
        return () => clearTimeout(timer);
    }, []);

    if (!game.latitude || !game.longitude) return null;

    // Apply jitter if there are multiple games at this exact location
    const COORD_OFFSET = 0.00018; // Small enough to be at the same park, large enough to see markers
    let lat = Number(game.latitude);
    let lng = Number(game.longitude);

    if (totalInGroup > 1) {
        // Spread markers in a small circle around the center point
        const angle = (2 * Math.PI * indexInGroup) / totalInGroup;
        lat += COORD_OFFSET * Math.cos(angle);
        lng += COORD_OFFSET * Math.sin(angle);
    }

    return (
        <Marker
            key={`${game.game.id}-${gameLength}`}
            identifier={`${game.game.id}-${gameLength}`}
            coordinate={{ latitude: lat, longitude: lng }}
            tracksViewChanges={trackChanges}
            onCalloutPress={() => onGamePress?.(game)}
            onPress={() => onGamePress?.(game)}
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
    onGamePress,
    onMapLongPress,
    longPressCoord,
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

    // Group games by coordinates to detect overlaps
    const groupedGames = React.useMemo(() => {
        const groups: Record<string, GameWithDetails[]> = {};
        games.forEach(game => {
            const key = `${game.latitude}-${game.longitude}`;
            if (!groups[key]) groups[key] = [];
            groups[key].push(game);
        });
        return groups;
    }, [games]);

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
                onLongPress={({ nativeEvent }) => onMapLongPress?.(nativeEvent.coordinate)}
            >
                {Object.values(groupedGames).flatMap((group) =>
                    group.map((game, index) => (
                        <CustomMarker
                            key={`${game.game.id}-${games.length}`}
                            game={game}
                            gameLength={games.length}
                            onGamePress={onGamePress}
                            indexInGroup={index}
                            totalInGroup={group.length}
                        />
                    ))
                )}

                {longPressCoord && (
                    <Marker
                        coordinate={longPressCoord}
                        title="New Game Location"
                        description="Long-press to move pin"
                        pinColor={COLORS.primary}
                    >
                        <View style={MapThemes.markerContainer}>
                            <View style={[MapThemes.markerBadge, { backgroundColor: COLORS.primary }]}>
                                <Ionicons name="add" size={24} color="#fff" />
                            </View>
                            <View style={[MapThemes.markerTail, { borderTopColor: COLORS.primary }]} />
                        </View>
                    </Marker>
                )}
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