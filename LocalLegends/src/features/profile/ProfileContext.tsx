import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { ProfileApi } from './api/ProfileApi';
import { useAuth } from '@/src/features/auth/AuthContext';
import { EditProfileRequest, EditProfileResponse, GetProfileResponse } from './profile.types';

type ProfileContextType = {
    profile: GetProfileResponse | null;
    isLoading: boolean;
    isInitialLoad: boolean;
    refreshProfile: () => Promise<void>;
    editProfile: (data: EditProfileRequest) => Promise<EditProfileResponse>;
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

    const editProfile = useCallback(async (data: EditProfileRequest): Promise<EditProfileResponse> => {
        if (!userId) throw new Error("No user ID");
        
        setIsLoading(true);
        try {
            const res = await ProfileApi.editProfile(data);
            setProfile(res);
            return res;
        } catch (error) {
            console.error("Error editing profile:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    const value = useMemo(() => ({
        profile,
        isLoading,
        isInitialLoad,
        refreshProfile,
        editProfile
    }), [profile, isLoading, isInitialLoad, refreshProfile, editProfile]);

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
