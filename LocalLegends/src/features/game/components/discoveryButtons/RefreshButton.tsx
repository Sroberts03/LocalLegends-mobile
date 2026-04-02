import { COLORS } from "@/src/themes/themes";
import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import { TouchableOpacity, Animated, Easing } from "react-native";
import { RefreshButtonStyles } from "../themes/RefreshButtonThemes";
import { BlurView } from "expo-blur";

type RefreshButtonProps = {
    onRefresh: () => void;
    isLoading: boolean;
};

export default function RefreshButton({ onRefresh, isLoading }: RefreshButtonProps) {
    const spinValue = useRef(new Animated.Value(0)).current;

    const startSpin = () => {
        spinValue.setValue(0);
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    };

    const stopSpin = () => {
        spinValue.stopAnimation();
    };

    // If external loading state changes, start/stop animation
    if (isLoading) {
        startSpin();
    } else {
        stopSpin();
    }

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });

    return (
        <TouchableOpacity 
            onPress={onRefresh} 
            disabled={isLoading}
            activeOpacity={0.7}
            style={RefreshButtonStyles.container}
        >
            <BlurView intensity={60} tint="light" style={RefreshButtonStyles.blurContainer}>
                <Animated.View style={{ 
                    transform: [{ rotate: spin }],
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Ionicons 
                        name="refresh" 
                        size={28} 
                        color={COLORS.textSecondary} 
                        style={{ marginLeft: 1.5 }}
                    />
                </Animated.View>
            </BlurView>
        </TouchableOpacity>
    );
}
