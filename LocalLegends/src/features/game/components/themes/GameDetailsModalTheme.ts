import { StyleSheet, Dimensions } from "react-native";
import { COLORS, BORDER_RADIUS, SPACING } from "@/src/themes/themes";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const gameDetailsModalThemes = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingBottom: 40,
        maxHeight: SCREEN_HEIGHT * 0.9,
        width: '100%',
    },
    handle: {
        width: 36,
        height: 5,
        backgroundColor: '#e2e8f0',
        borderRadius: 10,
        alignSelf: 'center',
        marginTop: 12,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    // NEW HERO SECTION
    heroSection: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 24,
    },
    iconHalo: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#eff6ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#dbeafe',
    },
    gameTitle: {
        fontSize: 26,
        fontWeight: "900",
        color: '#1e293b',
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    sportBadge: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        marginTop: 8,
    },
    sportText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '800',
        textTransform: 'uppercase',
    },

    // PROMINENT INFO CARDS (Time & Location)
    cardGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    mainCard: {
        flex: 1,
        backgroundColor: '#f8fafc',
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    cardIconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    cardLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748b',
        textTransform: 'uppercase',
    },
    cardValue: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1e293b',
    },
    cardSubValue: {
        fontSize: 13,
        color: '#94a3b8',
        marginTop: 2,
    },

    // STATS GRID
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 24,
    },
    statItem: {
        width: (SCREEN_WIDTH - 40 - 10) / 2, // 40 is total margin, 10 is gap
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    statIconBox: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statContent: {
        flex: 1,
    },
    statLabel: {
        fontSize: 10,
        fontWeight: '600',
        color: '#94a3b8',
        textTransform: 'uppercase',
    },
    statValue: {
        fontSize: 13,
        fontWeight: '700',
        color: '#334155',
    },

    // DESCRIPTION
    descriptionBox: {
        backgroundColor: '#fdf2f2', // Soft background for descriptions
        padding: 16,
        borderRadius: 16,
        marginBottom: 24,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
    },
    descriptionHeader: {
        fontSize: 14,
        fontWeight: '800',
        color: COLORS.primary,
        marginBottom: 4,
    },
    descriptionText: {
        fontSize: 15,
        color: '#475569',
        lineHeight: 22,
        fontStyle: 'italic',
    },

    // PLAYERS
    sectionTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1e293b',
    },
    countBadge: {
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    countText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#64748b',
    },
    playersGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    playerAvatarWrapper: {
        alignItems: 'center',
        width: (SCREEN_WIDTH - 40 - 24) / 3, // Grid of 3
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    playerName: {
        fontSize: 12,
        fontWeight: '600',
        color: '#334155',
        marginTop: 6,
        textAlign: 'center',
    },

    // FOOTER
    footerContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 12,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    clearButton: {
        flex: 1,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
    },
    clearButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#94a3b8',
    },
    applyButton: {
        flex: 2,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 6,
    },
    applyButtonText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#fff',
    },
});