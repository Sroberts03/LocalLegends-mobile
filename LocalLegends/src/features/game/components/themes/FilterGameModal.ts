import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "@/src/themes/themes";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export const FilterGameModalThemes = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.backgroundPrimary,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingBottom: 40,
        maxHeight: SCREEN_HEIGHT * 0.85,
        width: '100%',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 20,
    },
    handle: {
        width: 40,
        height: 5,
        backgroundColor: '#e2e8f0',
        borderRadius: 3,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1a202c',
        letterSpacing: -0.5,
    },
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4a5568',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    sectionValue: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.primary,
        backgroundColor: '#f0f9ff',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    footerContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 10,
    },
    clearButton: {
        flex: 1,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f7fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    clearButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#718096',
    },
    applyButton: {
        flex: 2,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    applyButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
    sliderTrack: {
        height: 40,
        justifyContent: 'center',
    },
});