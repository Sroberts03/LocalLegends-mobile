import CreateGameButton from "@/src/features/game/components/discoveryButtons/CreateGameButton";
import { GameDiscoveryTheme } from "./themes/GameDiscoveryTheme";
import { View } from "react-native";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import CreateGameModal from "./CreateGameModal";
import { GameFilter, GameWithDetails } from "@/src/models/Game";
import * as Location from 'expo-location';
import ButtonContainer from "./discoveryButtons/ButtonContainer";
import { GameApi } from "../api/GameApi";
import Map, { MapRef } from "@/src/features/game/components/Map";

const INITIAL_REGION = {
    latitude: 40.2338,
    longitude: -111.6585,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

export default function GameDiscovery() {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [games, setGames] = useState<GameWithDetails[]>([]);
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const mapRef = useRef<MapRef>(null);
    
    const filter = useMemo<GameFilter>(() => ({
        latitude: location?.coords.latitude || INITIAL_REGION.latitude,
        longitude: location?.coords.longitude || INITIAL_REGION.longitude,
        maxDistance: 25,
    }), [location?.coords.latitude, location?.coords.longitude]);

    const [isCreateGameModalVisible, setIsCreateGameModalVisible] = useState(false);

    const fetchGames = useCallback(async (isCancelledRef: { current: boolean }) => {
        if (isInitialLoad && !location) return;

        if (isInitialLoad) setLoading(true);
        setIsRefreshing(true);

        try {
            const gamesResponse = await GameApi.getGames({ filter });
            if (!isCancelledRef.current) {
                setGames(gamesResponse.games);
                setIsInitialLoad(false);
                setErrorMsg(null);
            }
        } catch (error) {
            if (!isCancelledRef.current) {
                console.error("Error fetching games:", error);
                setErrorMsg("Failed to load games");
            }
        } finally {
            if (!isCancelledRef.current) {
                setLoading(false);
                setIsRefreshing(false);
            }
        }
    }, [filter, isInitialLoad, location]);

    useEffect(() => {
        const isCancelledRef = { current: false };
        fetchGames(isCancelledRef);
        return () => { isCancelledRef.current = true; };
    }, [fetchGames]);

    const handleManualRefresh = () => {
        const isCancelledRef = { current: false };
        fetchGames(isCancelledRef);
    };

    const handleRefocus = () => {
        if (mapRef.current) {
            mapRef.current.refocus();
        }
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

    return (
        <View style={GameDiscoveryTheme.container}>
            <View style={GameDiscoveryTheme.map}>
                <Map 
                    ref={mapRef}
                    games={games}
                    filter={filter}
                    setGames={setGames}
                    loading={loading}
                    setLoading={setLoading}
                    errorMsg={errorMsg}
                    setErrorMsg={setErrorMsg}
                    location={location}
                    setLocation={setLocation}
                    INITIAL_REGION={INITIAL_REGION}
                />
            </View>
            {!isInitialLoad && (
                <View style={GameDiscoveryTheme.buttonContainer}>
                    <ButtonContainer 
                        onRefresh={handleManualRefresh}
                        onRefocus={handleRefocus}
                        isLoading={isRefreshing}
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
            />
        </View>
    );
}