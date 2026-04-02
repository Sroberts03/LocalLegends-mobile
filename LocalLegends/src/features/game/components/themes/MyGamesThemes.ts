import { StyleSheet } from "react-native";
import { BORDER_RADIUS, COLORS, SPACING } from "@/src/themes/themes";

export const MyGamesThemes = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundPrimary,
    },
    listContent: {
        padding: SPACING.md,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: "800",
        color: COLORS.primary,
        backgroundColor: COLORS.backgroundPrimary,
        paddingVertical: SPACING.sm,
        marginTop: SPACING.md,
        letterSpacing: 0.5,
    },
    card: {
        backgroundColor: COLORS.backgroundSecondary,
        borderRadius: BORDER_RADIUS.card,
        padding: SPACING.md,
        marginVertical: SPACING.sm,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.05)",
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "rgba(37, 99, 235, 0.1)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: SPACING.md,
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderWidth: 2,
        borderColor: '#fff',
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    cardInfo: {
        flex: 1,
    },
    gameName: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.text,
        marginBottom: 2,
    },
    locationContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    locationText: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginLeft: 4,
    },
    timeContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    timeText: {
        fontSize: 12,
        fontWeight: "600",
        color: COLORS.primary,
        marginLeft: 4,
    },
    chevron: {
        marginLeft: SPACING.sm,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: SPACING.xl,
        marginTop: 60,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: COLORS.text,
        marginTop: SPACING.md,
    },
    emptySubtitle: {
        fontSize: 15,
        color: COLORS.textSecondary,
        textAlign: "center",
        marginTop: SPACING.sm,
        lineHeight: 22,
    },
    findButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.md,
        borderRadius: BORDER_RADIUS.full,
        marginTop: SPACING.xl,
    },
    findButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    }
});
