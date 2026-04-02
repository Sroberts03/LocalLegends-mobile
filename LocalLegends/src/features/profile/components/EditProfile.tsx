import React, { useState } from "react";
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    Image, 
    ScrollView, 
    ActivityIndicator,
    Alert
} from "react-native";
import { useProfile } from "../ProfileContext";
import { useAuth } from "@/src/features/auth/AuthContext";
import { AuthApi } from "@/src/features/auth/api/AuthApi";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from "@expo/vector-icons";
import { editStyles as styles } from "../themes/EditProfileTheme";
import { useRouter } from "expo-router";

export default function EditProfile() {
    const { profile, editProfile } = useProfile();
    const { user } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const [displayName, setDisplayName] = useState(profile?.displayName || "");
    const [bio, setBio] = useState(profile?.bio || "");
    const [profilePicture, setProfilePicture] = useState(profile?.profileImageUrl || "");
    const [isSaving, setIsSaving] = useState(false);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setProfilePicture(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (!displayName.trim()) {
            setError('Display Name is required');
            return;
        }

        setIsSaving(true);
        try {
            let finalPhotoUrl = profilePicture;
            
            if (profilePicture && profilePicture.startsWith('file://') && user?.id) {
                finalPhotoUrl = await AuthApi.uploadProfilePhoto(profilePicture, user.id);
            }

            await editProfile({
                displayName,
                bio,
                profilePicture: finalPhotoUrl
            });

            Alert.alert('Success', 'Profile updated successfully!');
            router.back();
        } catch (error) {
            console.error('Save error:', error);
            setError('Failed to update profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Hero Avatar Section */}
                <View style={styles.avatarSection}>
                    <TouchableOpacity 
                        style={styles.avatarWrapper} 
                        onPress={pickImage}
                        activeOpacity={0.8}
                    >
                        {profilePicture ? (
                            <Image source={{ uri: profilePicture }} style={styles.avatar} />
                        ) : (
                            <View style={[styles.avatar, { justifyContent: 'center', alignItems: 'center' }]}>
                                <Ionicons name="person" size={60} color="#cbd5e1" />
                            </View>
                        )}
                        <View style={styles.editBadge}>
                            <Ionicons name="pencil" size={18} color="#fff" />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Form Inputs */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Display Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Your public name"
                        value={displayName}
                        onChangeText={setDisplayName}
                        placeholderTextColor="#94a3b8"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Bio</Text>
                    <TextInput
                        style={[styles.input, styles.bioInput]}
                        placeholder="Tell the community about yourself..."
                        value={bio}
                        onChangeText={setBio}
                        multiline
                        numberOfLines={4}
                        placeholderTextColor="#94a3b8"
                    />
                </View>

                {error && (
                    <Text style={styles.errorText}>{error}</Text>
                )}

                {/* Action Button */}
                <TouchableOpacity 
                    style={[styles.saveButton, isSaving && styles.saveButtonDisabled]} 
                    onPress={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    )}
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}