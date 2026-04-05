import CreateGameButton from "@/src/features/game/components/discoveryButtons/CreateGameButton";
import { GameDiscoveryTheme } from "./themes/GameDiscoveryTheme";
import { View, Alert, Platform, Linking } from "react-native";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import CreateGameModal from "./CreateGameModal";
import { GameFilter, GameWithDetails } from "@/src/models/Game";
import * as Location from 'expo-location';
import ButtonContainer from "./discoveryButtons/ButtonContainer";
import { GameApi } from "../api/GameApi";
import Map, { MapRef } from "@/src/features/game/components/Map";
import FilterGameModal from "./FilterGameModal";
import GameDetailsModal from "./GameDetailsModal";
import { useGameContext } from "../GameContext";

const INITIAL_REGION = {
    latitude: 40.2338,
    longitude: -111.6585,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

export default function GameDiscovery() {
    const { 
        discoveryGames: games, 
        isLoadingDiscovery: loading, 
        isInitialLoadDiscovery: isInitialLoad,
        refreshDiscovery: handleManualRefresh,
        filters: filter,
        setFilters,
        location,
        errorMsg,
        joinGame,
        leaveGame
    } = useGameContext();

    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const mapRef = useRef<MapRef>(null);
    
    // MODAL STATE
    const [selectedGame, setSelectedGame] = useState<GameWithDetails | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    
    const [isCreateGameModalVisible, setIsCreateGameModalVisible] = useState(false);
    const [longPressLocation, setLongPressLocation] = useState<{ latitude: number, longitude: number } | null>(null);

    const handleRefocus = () => {
        if (mapRef.current && location) {
            mapRef.current.refocus();
        }
    };

    const handleApplyFilters = (newFilters: GameFilter) => {
        setFilters(newFilters);
        setIsFilterModalVisible(false);
    };

    const handleMarkerPress = (game: GameWithDetails) => {
        setSelectedGame(game);
        setIsModalVisible(true);
    };

    const handleJoin = async () => {
        if (!selectedGame) return;
        try {
            await joinGame(selectedGame.game.id);
        } catch (error) {
            console.error("Failed to join game:", error);
        }
    };

    const handleMapLongPress = (coord: { latitude: number, longitude: number }) => {
        setLongPressLocation(coord);
        setIsCreateGameModalVisible(true);
    };

    const handleLeave = async () => {
        if (!selectedGame) return;
        try {
            await leaveGame(selectedGame.game.id);
        } catch (error) {
            console.error("Failed to leave game:", error);
        }
    };

    const handleAddressPress = () => {
        if (!selectedGame) return;
        
        const { latitude, longitude, locationName } = selectedGame;
        const scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
        const url = Platform.select({
            ios: `${scheme}0,0?q=${locationName}&ll=${latitude},${longitude}`,
            android: `${scheme}${latitude},${longitude}?q=${locationName}`
        });

        Alert.alert(
            "Open in Maps",
            "Choose your preferred maps provider",
            [
                {
                    text: "Apple Maps",
                    onPress: () => {
                        const appleUrl = `http://maps.apple.com/?q=${locationName}&ll=${latitude},${longitude}`;
                        Linking.openURL(appleUrl);
                    }
                },
                {
                    text: "Google Maps",
                    onPress: () => {
                        const googleUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
                        Linking.openURL(googleUrl);
                    }
                },
                {
                    text: "Cancel",
                    style: "cancel"
                }
            ]
        );
    };

    return (
        <View style={GameDiscoveryTheme.container}>
            <View style={GameDiscoveryTheme.map}>
                <Map 
                    ref={mapRef}
                    games={games}
                    filter={filter}
                    setGames={() => {}} 
                    loading={isInitialLoad}
                    setLoading={() => {}} 
                    errorMsg={errorMsg}
                    setErrorMsg={() => {}} 
                    location={location}
                    setLocation={() => {}} 
                    INITIAL_REGION={INITIAL_REGION}
                    onGamePress={handleMarkerPress}
                    onMapLongPress={handleMapLongPress}
                    longPressCoord={longPressLocation}
                />
            </View>
            {!isInitialLoad && (
                <View style={GameDiscoveryTheme.buttonContainer}>
                    <ButtonContainer 
                        onRefresh={handleManualRefresh}
                        onRefocus={handleRefocus}
                        isLoading={loading}
                        setIsFilterModalVisible={setIsFilterModalVisible}
                    />
                </View>
            )}
            <View style={GameDiscoveryTheme.createGameButton}>
                <CreateGameButton 
                    setIsCreateGameModalVisible={setIsCreateGameModalVisible} 
                />
            </View>
            <CreateGameModal 
                isVisible={isCreateGameModalVisible} 
                setIsCreateGameModalVisible={setIsCreateGameModalVisible} 
                initialLocation={longPressLocation}
                onModalClose={() => setLongPressLocation(null)}
            />
            <FilterGameModal 
                isVisible={isFilterModalVisible} 
                setIsFilterModalVisible={setIsFilterModalVisible} 
                currentFilter={filter}
                onApply={handleApplyFilters}
            />

            <GameDetailsModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                game={selectedGame!}
                onJoin={handleJoin}
                onLeave={handleLeave}
                onAddressPress={handleAddressPress}
            />
        </View>
    );
}