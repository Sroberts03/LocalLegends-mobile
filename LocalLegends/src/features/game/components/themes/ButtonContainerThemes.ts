import { StyleSheet } from "react-native";
import { COLORS } from "@/src/themes/themes";

export const ButtonContainerStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
    },
});