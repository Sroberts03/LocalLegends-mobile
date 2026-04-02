import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { GameWithDetails, GameFilter } from '@/src/models/Game';
import { GameApi } from './api/GameApi';
import * as Location from 'expo-location';
import { useAuth } from '@/src/features/auth/AuthContext';

type GameContextType = {
    // Discovery
    discoveryGames: GameWithDetails[];
    isLoadingDiscovery: boolean;
    isInitialLoadDiscovery: boolean;
    refreshDiscovery: () => Promise<void>;
    
    // My Games (Schedule)
    myGames: GameWithDetails[];
    isLoadingMyGames: boolean;
    isInitialLoadMyGames: boolean;
    refreshMyGames: () => Promise<void>;
    
    // Shared State
    filters: GameFilter;
    setFilters: (filters: GameFilter) => void;
    location: Location.LocationObject | null;
    errorMsg: string | null;

    // Actions
    joinGame: (gameId: string) => Promise<void>;
    leaveGame: (gameId: string) => Promise<void>;
};

const INITIAL_REGION = {
    latitude: 40.2338,
    longitude: -111.6585,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
    const [discoveryGames, setDiscoveryGames] = useState<GameWithDetails[]>([]);
    const [myGames, setMyGames] = useState<GameWithDetails[]>([]);
    const [isLoadingDiscovery, setIsLoadingDiscovery] = useState(true);
    const [isLoadingMyGames, setIsLoadingMyGames] = useState(true);
    const [isInitialLoadDiscovery, setIsInitialLoadDiscovery] = useState(true);
    const [isInitialLoadMyGames, setIsInitialLoadMyGames] = useState(true);
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const { session } = useAuth();
    const userId = session?.user?.id;

    const [filters, setFilters] = useState<GameFilter>({
        latitude: INITIAL_REGION.latitude,
        longitude: INITIAL_REGION.longitude,
        maxDistance: 25,
        sportIds: [],
        skillLevels: [],
        genderPreferences: [],
        favoritesOnly: false,
        happeningTodayOnly: false,
    });

    // 1. Get User Location
    useEffect(() => {
        (async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied');
                    return;
                }
                let currentLocation = await Location.getCurrentPositionAsync({});
                console.log("DEBUG: Context - Location Found:", currentLocation.coords.latitude, currentLocation.coords.longitude);
                setLocation(currentLocation);
                
                // Update filters with location
                setFilters(prev => ({
                    ...prev,
                    latitude: currentLocation.coords.latitude,
                    longitude: currentLocation.coords.longitude,
                }));
            } catch (err) {
                console.error("Error getting location:", err);
                setErrorMsg('Could not fetch location.');
            }
        })();
    }, []);

    // 2. Fetch Discovery Games
    const refreshDiscovery = useCallback(async () => {
        // Guard: Don't search if coordinates are invalid or user is logged out
        if (!userId || isNaN(filters.latitude) || isNaN(filters.longitude)) {
            console.log("DEBUG: Context - Skipping Discovery, invalid coordinates or no user");
            return;
        }

        // Clean filters: remove empty arrays, undefined, or false values that shouldn't be sent
        const cleanedFilter: any = { ...filters };
        
        if (cleanedFilter.sportIds?.length === 0) delete cleanedFilter.sportIds;
        if (cleanedFilter.skillLevels?.length === 0) delete cleanedFilter.skillLevels;
        if (cleanedFilter.genderPreferences?.length === 0) delete cleanedFilter.genderPreferences;
        if (!cleanedFilter.favoritesOnly) delete cleanedFilter.favoritesOnly;
        if (!cleanedFilter.happeningTodayOnly) delete cleanedFilter.happeningTodayOnly;

        console.log("DEBUG: Context - Refreshing Discovery with filters:", JSON.stringify(cleanedFilter));
        setIsLoadingDiscovery(true);
        try {
            const res = await GameApi.getGames({ filter: cleanedFilter });
            console.log("DEBUG: Context - Discovery Games Found:", res.games.length);
            setDiscoveryGames(res.games);
            setErrorMsg(null);
            setIsInitialLoadDiscovery(false);
        } catch (error) {
            console.error("Error fetching discovery games:", error);
            setErrorMsg("Failed to load map games");
        } finally {
            setIsLoadingDiscovery(false);
        }
    }, [filters, userId]);

    // 3. Fetch My Games
    const refreshMyGames = useCallback(async () => {
        if (!userId) return;
        setIsLoadingMyGames(true);
        try {
            const res = await GameApi.getMyGames();
            // Sanitize dates
            const sanitizedGames = res.games.map(g => ({
                ...g,
                game: { ...g.game, startTime: new Date(g.game.startTime) }
            }));
            setMyGames(sanitizedGames);
            setIsInitialLoadMyGames(false);
        } catch (error) {
            console.error("Error fetching my games:", error);
        } finally {
            setIsLoadingMyGames(false);
        }
    }, [userId]);

    // 4. Session-Aware Management
    useEffect(() => {
        if (!userId) {
            console.log("DEBUG: Context - User logged out, clearing state");
            setDiscoveryGames([]);
            setMyGames([]);
            setIsInitialLoadDiscovery(true);
            setIsInitialLoadMyGames(true);
            setFilters(prev => ({
                ...prev,
                sportIds: [],
                skillLevels: [],
                genderPreferences: [],
                favoritesOnly: false,
                happeningTodayOnly: false,
            }));
        }
    }, [userId]);

    // Triggers discovery refresh when user changes OR filters change
    useEffect(() => {
        if (userId) refreshDiscovery();
    }, [userId, refreshDiscovery]);

    // Triggers myGames refresh when user changes
    useEffect(() => {
        if (userId) refreshMyGames();
    }, [userId, refreshMyGames]);

    // 5. Participation Actions
    const joinGame = useCallback(async (gameId: string) => {
        try {
            await GameApi.joinGame({ gameId });
            // Update both lists to reflect participation
            await Promise.all([refreshDiscovery(), refreshMyGames()]);
        } catch (error) {
            console.error("Failed to join game:", error);
            throw error;
        }
    }, [refreshDiscovery, refreshMyGames]);

    const leaveGame = useCallback(async (gameId: string) => {
        try {
            await GameApi.leaveGame({ gameId });
            // Update both lists to reflect participation
            await Promise.all([refreshDiscovery(), refreshMyGames()]);
        } catch (error) {
            console.error("Failed to leave game:", error);
            throw error;
        }
    }, [refreshDiscovery, refreshMyGames]);

    const value = useMemo(() => ({
        discoveryGames,
        isLoadingDiscovery,
        isInitialLoadDiscovery,
        refreshDiscovery,
        myGames,
        isLoadingMyGames,
        isInitialLoadMyGames,
        refreshMyGames,
        filters,
        setFilters,
        location,
        errorMsg,
        joinGame,
        leaveGame
    }), [
        discoveryGames, 
        isLoadingDiscovery, 
        isInitialLoadDiscovery,
        refreshDiscovery, 
        myGames, 
        isLoadingMyGames, 
        isInitialLoadMyGames,
        refreshMyGames, 
        filters, 
        location, 
        errorMsg, 
        joinGame, 
        leaveGame
    ]);

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
}

export const useGameContext = () => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGameContext must be used within a GameProvider');
    }
    return context;
};
