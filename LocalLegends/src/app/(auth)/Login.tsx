import { Text, View } from "react-native";
import LoginForm from "@/src/features/auth/components/LoginForm";
import { ScrollView } from "react-native";

export default function LoginPage() {
    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
                <LoginForm />
            </ScrollView>
        </View>
    );
}