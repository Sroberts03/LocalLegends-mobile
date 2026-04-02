import { StyleSheet } from "react-native";
import { COLORS } from "@/src/themes/themes";

export const RefreshButtonStyles = StyleSheet.create({
    container: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.6)',
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 5,
    },
    blurContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});