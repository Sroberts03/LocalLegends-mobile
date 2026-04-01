import { AuthApi } from "../api/AuthApi";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { SignUpFormData } from "../Auth.types";
import { TextInput, View, Text, TouchableOpacity, Keyboard, StyleSheet, Alert } from "react-native";
import { styles as loginStyles } from "./themes/LoginFormStyle";
import { globalStyles } from "@/src/themes/GlobalStyleSheet";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/src/themes/themes";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";

export default function SignUpForm() {
    const [formData, setFormData] = useState<SignUpFormData>({
        email: "",
        password: "",
        displayName: "",
        profileImageUrl: ""
    });
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [visiblePassword, setVisiblePassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const { user, session } = await AuthApi.signUp(formData);
            if (user && session) {
                let imageUrl: string | null = null;
                const profileImage = selectedImage ?? "";
                if (profileImage) {
                    imageUrl = await AuthApi.uploadProfilePhoto(profileImage, user.id);
                }
                if (imageUrl) {
                    await AuthApi.finishSignUp(imageUrl, formData.displayName, user.id);
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        Keyboard.dismiss();
        setVisiblePassword(!visiblePassword);
    };

    const handleLogin = () => {
        router.push("/Login");
    };

    return (
        <SafeAreaView style={globalStyles.safeArea}>
            <View style={globalStyles.container}>
                <TouchableOpacity onPress={pickImage} style={styles.avatarContainer} disabled={loading}>
                    {selectedImage ? (
                        <Image source={{ uri: selectedImage }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Ionicons name="camera" size={40} color={COLORS.primary} />
                            <Text style={styles.avatarText}>Add Photo</Text>
                        </View>
                    )}
                    <View style={styles.editBadge}>
                        <Ionicons name="pencil" size={14} color="#fff" />
                    </View>
                </TouchableOpacity>

                <Text style={globalStyles.title}>
                    Sign Up for LocalLegends
                </Text>
                <Text style={globalStyles.subtitle}>
                    Create a new account
                </Text>

                <TextInput
                    placeholder="Full Name"
                    value={formData.displayName}
                    onChangeText={(text) => setFormData({ ...formData, displayName: text })}
                    style={globalStyles.input}
                    editable={!loading}
                />
                <TextInput
                    placeholder="Email"
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                    style={globalStyles.input}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    editable={!loading}
                />
                <TextInput
                    placeholder="Password"
                    value={formData.password}
                    onChangeText={(text) => setFormData({ ...formData, password: text })}
                    secureTextEntry={!visiblePassword}
                    style={globalStyles.input}
                    editable={!loading}
                />
                <TouchableOpacity onPress={togglePasswordVisibility} style={loginStyles.showPassword}>
                    <Ionicons name={visiblePassword ? "eye" : "eye-off"} size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
               

                {error && <Text style={globalStyles.errorText}>{error}</Text>}
                <TouchableOpacity onPress={handleSubmit} style={globalStyles.buttonPrimary} disabled={loading}>
                    <Text style={globalStyles.buttonPrimaryText}>{loading ? "Creating account..." : "Create Account"}</Text>
                </TouchableOpacity>

                <View style={loginStyles.signUpContainer}>
                    <Text>
                        Already have an account?
                    </Text>
                    <TouchableOpacity onPress={handleLogin}>
                        <Text style={loginStyles.signUpText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    avatarContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#f3f4f600",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
        borderWidth: 1,
        borderColor: COLORS.border,
        position: "relative",
        overflow: "visible",
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    avatarPlaceholder: {
        alignItems: "center",
        justifyContent: "center",
    },
    avatarText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 4,
        fontWeight: "600",
    },
    editBadge: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.primary,
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 3,
        borderColor: COLORS.backgroundSecondary,
        justifyContent: "center",
        alignItems: "center",
    },
});