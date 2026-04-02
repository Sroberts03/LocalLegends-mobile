import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '@/src/themes/themes';

const { width } = Dimensions.get('window');

export const profileThemes = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc', // Light slate-50
    },
    headerGradient: {
        width: '100%',
        paddingTop: 60,
        paddingBottom: 40,
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        position: 'relative',
    },
    topButtonsContainer: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        zIndex: 10,
    },
    headerIconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f8fafc',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 4,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
    },
    avatarFallback: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#fff',
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.primary,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e293b', // Deep slate
        marginBottom: 4,
    },
    username: {
        fontSize: 16,
        color: '#64748b', // Slate 500
    },
    bio: {
        fontSize: 14,
        color: '#475569', // Slate 600
        textAlign: 'center',
        marginTop: 12,
        paddingHorizontal: 40,
        lineHeight: 20,
    },
    
    // Stats Section
    statsRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginTop: -30,
        marginBottom: 24,
        justifyContent: 'space-between',
    },
    statCard: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 16,
        marginHorizontal: 5,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#94a3b8',
        textAlign: 'center',
        fontWeight: '600',
    },

    // Content Sections
    section: {
        paddingHorizontal: 20,
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 16,
    },
    
    // Favorite Sports
    sportsList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    sportChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eff6ff', 
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        marginRight: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#dbeafe',
    },
    sportText: {
        color: COLORS.primary,
        marginLeft: 6,
        fontWeight: '600',
        fontSize: 14,
    },

    // Recent Activity
    gameCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 1,
    },
    gameIconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#f8fafc',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    gameInfo: {
        flex: 1,
    },
    gameName: {
        color: '#1e293b',
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 4,
    },
    gameDate: {
        color: '#94a3b8',
        fontSize: 12,
    },
    gameStatus: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        backgroundColor: '#f0fdf4',
    },
    statusText: {
        color: '#22c55e',
        fontSize: 11,
        fontWeight: 'bold',
    },

    // Logout Button
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        marginHorizontal: 20,
        marginBottom: 40,
        borderRadius: 16,
        backgroundColor: '#fef2f2',
        borderWidth: 1,
        borderColor: '#fee2e2',
    },
    logoutText: {
        color: '#ef4444',
        fontWeight: 'bold',
        marginLeft: 8,
        fontSize: 16,
    },

    // Loading State
    centerContainer: {
        flex: 1,
        backgroundColor: '#f8fafc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#64748b',
        marginTop: 12,
        fontSize: 16,
    },
    editSportsBadge: {
        position: 'absolute',
        bottom: 27,
        right: 210,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
