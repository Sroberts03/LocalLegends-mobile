import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/src/themes/themes';

type FilterSectionProps = {
    title: string;
    value?: string;
    children: React.ReactNode;
    style?: any;
}

export const FilterSection = ({ title, value, children, style }: FilterSectionProps) => (
    <View style={[styles.section, style]}>
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {value && <Text style={styles.sectionValue}>{value}</Text>}
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {children}
        </View>
    </View>
);

const styles = StyleSheet.create({
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
});
