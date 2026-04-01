import { View } from "react-native";
import { ScrollView } from "react-native";
import SignUpForm from "@/src/features/auth/components/SignUpForm";

export default function SignUpPage() {
    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
                <SignUpForm />
            </ScrollView>
        </View>
    );
}