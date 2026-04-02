import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#64748b',
        textTransform: 'uppercase',
        marginBottom: 12,
        marginTop: 8,
        letterSpacing: 0.5,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        marginBottom: 24,
        paddingVertical: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBackground: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#eff6ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    label: {
        fontSize: 16,
        color: '#1e293b',
        fontWeight: '500',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fef2f2',
        padding: 16,
        borderRadius: 16,
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#fee2e2',
    },
    logoutText: {
        color: '#ef4444',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 8,
    },
    versionText: {
        textAlign: 'center',
        color: '#94a3b8',
        fontSize: 12,
        marginTop: 24,
    }
});
