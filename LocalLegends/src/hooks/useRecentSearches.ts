import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@recent_searches';
const MAX_RECENT_SEARCHES = 10;

export default function useRecentSearches() {
    const [recentSearches, setRecentSearches] = useState<string[]>([]);

    // Load saved searches when the app opens
    useEffect(() => {
        async function loadSearches() {
            try {
                const storedSearches = await AsyncStorage.getItem(STORAGE_KEY);
                if (storedSearches) {
                    setRecentSearches(JSON.parse(storedSearches));
                }
            } catch (error) {
                console.error('Failed to load recent searches', error);
            }
        }
        loadSearches();
    }, []);

    // Add a new search
    const addSearch = async (query: string) => {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) return;

        try {
            setRecentSearches(prevSearches => {
                // 1. Remove the query if it already exists (prevents duplicates)
                const filtered = prevSearches.filter(item => item.toLowerCase() !== trimmedQuery.toLowerCase());
                
                // 2. Put the new query at the very top
                const updated = [trimmedQuery, ...filtered];
                
                // 3. Keep only the top 10
                const limited = updated.slice(0, MAX_RECENT_SEARCHES);
                
                // Save to phone storage asynchronously
                AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
                
                return limited;
            });
        } catch (error) {
            console.error('Failed to save search', error);
        }
    };

    // Clear all searches
    const clearSearches = async () => {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
            setRecentSearches([]);
        } catch (error) {
            console.error('Failed to clear searches', error);
        }
    };

    return { recentSearches, addSearch, clearSearches };
}