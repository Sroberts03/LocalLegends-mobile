import { TouchableOpacity, Text } from "react-native";
import { AuthApi } from "@/src/features/auth/api/AuthApi";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Logout() {
    return (
       <SafeAreaView>
            <TouchableOpacity onPress={AuthApi.logout}>
                <Text>Logout</Text>
            </TouchableOpacity>
       </SafeAreaView>
    );
}