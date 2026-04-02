import { Stack } from 'expo-router';
import EditProfile from '../features/profile/components/EditProfile';

export default function EditProfileScreen() {
    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Edit Profile',
                    headerShown: true,
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: '#f8fafc' },
                    headerTintColor: '#1e293b',
                    headerTitleStyle: { fontWeight: 'bold' },
                    headerBackTitle: 'Profile',
                }}
            />
            <EditProfile />
        </>
    );
}
