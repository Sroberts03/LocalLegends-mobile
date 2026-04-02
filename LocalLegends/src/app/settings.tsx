import Settings from '@/src/features/profile/components/Settings';
import { Stack } from 'expo-router';

export default function SettingsScreen() {
    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Settings',
                    headerShown: true,
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: '#f8fafc' },
                    headerTintColor: '#1e293b',
                    headerTitleStyle: { fontWeight: 'bold' },
                    headerBackTitle: 'Profile',
                }}
            />
            <Settings />
        </>
    );
}
