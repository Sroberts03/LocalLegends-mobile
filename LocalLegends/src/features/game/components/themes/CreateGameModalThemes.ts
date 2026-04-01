import { StyleSheet } from "react-native";
import { COLORS } from "@/src/themes/themes";

export const CreateGameModalTheme = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    content: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
        width: '100%',
    },
    handle: {
        width: 40,
        height: 5,
        backgroundColor: '#e2e8f0',
        borderRadius: 2.5,
        alignSelf: 'center',
        marginBottom: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a202c',
    },
    description: {
        fontSize: 16,
        color: '#4a5568',
        lineHeight: 22,
    },
});