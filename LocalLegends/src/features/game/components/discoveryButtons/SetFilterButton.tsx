import { COLORS } from "@/src/themes/themes";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { RefreshButtonStyles } from "../themes/RefreshButtonThemes";
import { BlurView } from "expo-blur";

export default function SetFilterButton({ setIsFilterModalVisible }: { setIsFilterModalVisible: (isVisible: boolean) => void }) {
    const handleSetFilter = () => {
        setIsFilterModalVisible(true);
    };

    return (
        <TouchableOpacity 
            onPress={handleSetFilter} 
            activeOpacity={0.7}
            style={RefreshButtonStyles.container}
        >
            <BlurView intensity={60} tint="light" style={RefreshButtonStyles.blurContainer}>
                <Ionicons 
                    name="options" 
                    size={24} 
                    color={COLORS.textSecondary} 
                />
            </BlurView>
        </TouchableOpacity>
    );
}