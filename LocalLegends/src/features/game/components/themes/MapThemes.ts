import { StyleSheet } from "react-native";
import { COLORS } from "@/src/themes/themes";

export const MapThemes = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
    },
    loadingText: {
        marginTop: 12,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    markerBadge: {
        backgroundColor: COLORS.primary,
        padding: 6,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#fff',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    markerContainer: {
        alignItems: 'center',
    },
    markerTail: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderTopWidth: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: COLORS.primary,
        marginTop: -3,
    },
    errorBadge: {
        position: 'absolute',
        top: 50,
        alignSelf: 'center',
        backgroundColor: 'rgba(239, 68, 68, 0.9)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    errorText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
});