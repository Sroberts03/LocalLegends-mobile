import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';

export interface UserLocation {
    latitude: number;
    longitude: number;
}

export default function useUserLocation() {
    const [location, setLocation] = useState<UserLocation | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Wrapped in useCallback so it can be safely used in useEffects elsewhere
    const fetchLocation = useCallback(async () => {
        setIsLoading(true);
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                setIsLoading(false);
                return;
            }

            let currentLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            setLocation({
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude
            });
            setErrorMsg(null);
        } catch (error) {
            console.error("Error fetching location:", error);
            setErrorMsg('Make sure your location services are turned on.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLocation();
    }, [fetchLocation]);

    // Export the fetchLocation function so buttons can trigger it!
    return { location, errorMsg, isLoading, fetchLocation };
}