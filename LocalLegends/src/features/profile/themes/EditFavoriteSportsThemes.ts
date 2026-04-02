import { StyleSheet } from "react-native";
import { COLORS } from "@/src/themes/themes";

export const EditFavoriteSportsThemes = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    cancelButton: {
        fontSize: 16,
        color: '#64748b',
    },
    doneButton: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: 20,
    },
    subtitle: {
        fontSize: 15,
        color: '#64748b',
        marginBottom: 24,
        textAlign: 'center',
        lineHeight: 22,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'space-between',
    },
    sportCard: {
        width: '31%', // Approximately 3 items per row
        aspectRatio: 1,
        backgroundColor: '#f8fafc',
        borderRadius: 20,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
        position: 'relative',
    },
    sportCardSelected: {
        backgroundColor: '#eff6ff',
        borderColor: COLORS.primary,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    iconContainerSelected: {
        backgroundColor: COLORS.primary,
    },
    sportLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748b',
        textAlign: 'center',
    },
    sportLabelSelected: {
        color: COLORS.primary,
    },
    checkmark: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#fff',
        borderRadius: 10,
    }
});