import { AuthApi } from "../api/AuthApi";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoginFormData } from "../Auth.types";
import { TextInput, View, Text, TouchableOpacity, Keyboard } from "react-native";
import { styles } from "./themes/LoginFormStyle";
import { globalStyles } from "@/src/themes/GlobalStyleSheet";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/src/themes/themes";
import { router } from "expo-router";

export default function LoginForm() {
    const [formData, setFormData] = useState<LoginFormData>({
        email: "",
        password: ""
    });
    const [error, setError] = useState<string | null>(null);
    const [visiblePassword, setVisiblePassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            await AuthApi.login(formData);
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

    const handleSignUp = () => {
        router.push("/SignUp");
    };

    return (
        <SafeAreaView style={globalStyles.safeArea}>
            <View style={globalStyles.container}>
                <Ionicons name="basketball" size={100} color={COLORS.primary} style={styles.icon} />

                <Text style={globalStyles.title}>
                    Welcome Back To LocalLegends
                </Text>
                <Text style={globalStyles.subtitle}>
                    Login to your account
                </Text>

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
                <TouchableOpacity onPress={togglePasswordVisibility} style={styles.showPassword}>
                    <Ionicons name={visiblePassword ? "eye" : "eye-off"} size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
               

                {error && <Text style={globalStyles.errorText}>{error}</Text>}
                <TouchableOpacity onPress={handleSubmit} style={globalStyles.buttonPrimary} disabled={loading}>
                    <Text style={globalStyles.buttonPrimaryText}>{loading ? "Logging in..." : "Login"}</Text>
                </TouchableOpacity>

                <View style={styles.signUpContainer}>
                    <Text>
                        Don&apos;t have an account?
                    </Text>
                    <TouchableOpacity onPress={handleSignUp}>
                        <Text style={styles.signUpText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}