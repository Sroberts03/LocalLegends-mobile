import { StyleSheet } from "react-native";
import { COLORS } from "@/src/themes/themes";

export const CreateGameThemes = StyleSheet.create({
    createGameButton: {
        backgroundColor: COLORS.primary,
        width: 60,
        height: 60,
        padding: 12,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3.84,
        elevation: 5,
    },
});