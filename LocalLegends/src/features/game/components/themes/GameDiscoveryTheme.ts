import { StyleSheet } from "react-native";
import { COLORS } from "@/src/themes/themes";

export const GameDiscoveryTheme = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundPrimary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    createGameButton: {
        position: 'absolute',
        bottom: 100,
        right: 20,
    },
    buttonContainer: {
        position: 'absolute',
        top: 50,
        right: 10,
    },
});