import { COLORS } from "@/src/themes/themes";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { RefreshButtonStyles } from "../themes/RefreshButtonThemes";
import { BlurView } from "expo-blur";

type RefocusButtonProps = {
    onRefocus: () => void;
};

export default function RefocusButton({ onRefocus }: RefocusButtonProps) {
    return (
        <TouchableOpacity 
            onPress={onRefocus} 
            activeOpacity={0.7}
            style={RefreshButtonStyles.container}
        >
            <BlurView intensity={60} tint="light" style={RefreshButtonStyles.blurContainer}>
                <Ionicons 
                    name="navigate" 
                    size={24} 
                    color={COLORS.textSecondary} 
                />
            </BlurView>
        </TouchableOpacity>
    );
}
