import { AuthApi } from "@/src/features/auth/api/AuthApi";
import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
    return (
        <SafeAreaView>
            <TouchableOpacity onPress={() => AuthApi.logout()}>
                <Text>Logout</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}