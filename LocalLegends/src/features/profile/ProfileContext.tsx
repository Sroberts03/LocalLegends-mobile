import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { ProfileApi } from './api/ProfileApi';
import { useAuth } from '@/src/features/auth/AuthContext';
import { GetProfileResponse } from './profile.types';

type ProfileContextType = {
    profile: GetProfileResponse | null;
    isLoading: boolean;
    isInitialLoad: boolean;
    refreshProfile: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
    const [profile, setProfile] = useState<GetProfileResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    
    const { session } = useAuth();
    const userId = session?.user?.id;

    const refreshProfile = useCallback(async () => {
        if (!userId) return;
        
        setIsLoading(true);
        try {
            const res = await ProfileApi.getMyProfile();
            setProfile(res);
            setIsInitialLoad(false);
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    // Cleanup and re-fetch logic
    useEffect(() => {
        if (!userId) {
            setProfile(null);
            setIsInitialLoad(true);
            setIsLoading(false);
            return;
        }

        refreshProfile();
    }, [userId, refreshProfile]);

    const value = useMemo(() => ({
        profile,
        isLoading,
        isInitialLoad,
        refreshProfile
    }), [profile, isLoading, isInitialLoad, refreshProfile]);

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
