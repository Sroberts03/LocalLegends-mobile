import { Stack } from 'expo-router';
import Notifications from '@/src/features/profile/components/Notifications';

export default function NotificationsScreen() {
    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Notifications',
                    headerShown: true,
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: '#f8fafc' },
                    headerTintColor: '#1e293b',
                    headerTitleStyle: { fontWeight: 'bold' },
                    headerBackTitle: 'Profile',
                }}
            />
            <Notifications />
        </>
    );
}
