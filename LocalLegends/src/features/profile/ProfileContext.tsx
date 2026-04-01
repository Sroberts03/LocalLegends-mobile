import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../auth/AuthContext';
import { ProfileApi } from './api/ProfileApi';
import Profile from '@/src/models/Profile';
import Game from '@/src/models/Game';

type ProfileContextType = {
    profile: Profile | null;
    favoriteSports: string[];
    mostRecentGames: Game[];
    isLoading: boolean;
    error: Error | null;
    refreshProfile: () => Promise<void>;
    addMostRecentGame: (game: Game) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
    const { user, isLoading: authLoading } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [favoriteSports, setFavoriteSports] = useState<string[]>([]);
    const [mostRecentGames, setMostRecentGames] = useState<Game[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchProfileData = useCallback(async (userId: string) => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await ProfileApi.getProfileInfo(userId);
            
            setProfile(data.profile);
            setFavoriteSports(data.favoriteSports || []);
            setMostRecentGames(data.mostRecentGames || []);
        } catch (err) {
            console.error("Error fetching profile context data:", err);
            setError(err instanceof Error ? err : new Error('Failed to fetch profile info'));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!authLoading && user) {
            fetchProfileData(user.id);
        } else if (!authLoading && !user) {
            setProfile(null);
            setFavoriteSports([]);
            setMostRecentGames([]);
        }
    }, [user, authLoading, fetchProfileData]);

    const refreshProfile = async () => {
        if (user) {
            await fetchProfileData(user.id);
        }
    };

    const addMostRecentGame = (game: Game) => {
        setMostRecentGames(prev => [game, ...prev].slice(0, 5));
    };

    const value = {
        profile,
        favoriteSports,
        mostRecentGames,
        isLoading: isLoading || authLoading,
        error,
        refreshProfile,
        addMostRecentGame
    };

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
}

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (context === undefined) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
};
