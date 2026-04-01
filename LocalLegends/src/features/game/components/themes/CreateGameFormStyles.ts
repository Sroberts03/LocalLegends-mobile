import { StyleSheet } from "react-native";
import { COLORS } from "@/src/themes/themes";

export const CreateGameFormStyles = StyleSheet.create({
    container: {
        width: '100%',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 16,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#edf2f7',
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '800',
        color: COLORS.primary,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    label: {
        fontSize: 13,
        fontWeight: '700',
        color: '#718096',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#f7fafc',
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        color: '#1a202c',
        borderWidth: 1,
        borderColor: '#edf2f7',
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 4,
    },
    column: {
        flex: 1,
    },
    sportChips: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    sportChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#edf2f7',
        marginRight: 8,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    sportChipActive: {
        backgroundColor: COLORS.primary + '15',
        borderColor: COLORS.primary,
    },
    sportChipText: {
        fontSize: 14,
        color: '#4a5568',
        fontWeight: '600',
    },
    sportChipTextActive: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    sliderContainer: {
        marginBottom: 24,
    },
    sliderLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    sliderValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    errorText: {
        color: '#e53e3e',
        fontSize: 13,
        fontWeight: '600',
        marginTop: -10,
        marginBottom: 16,
        textAlign: 'center',
    },
    submitButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 16,
        padding: 18,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    submitButtonDisabled: {
        backgroundColor: '#cbd5e0',
        shadowOpacity: 0,
        elevation: 0,
    }
});
