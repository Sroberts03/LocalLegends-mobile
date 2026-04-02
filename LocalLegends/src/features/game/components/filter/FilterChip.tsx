import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/src/themes/themes';

type FilterChipProps = {
    label: string;
    isActive: boolean;
    onPress: () => void;
}

export const FilterChip = ({ label, isActive, onPress }: FilterChipProps) => (
    <TouchableOpacity
        onPress={onPress}
        style={[
            styles.chip,
            isActive ? styles.chipActive : styles.chipInactive
        ]}
    >
        <Text style={[
            styles.chipText,
            isActive ? styles.chipTextActive : styles.chipTextInactive
        ]}>
            {label}
        </Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
    },
    chipInactive: {
        backgroundColor: '#f1f5f9',
        borderColor: '#e2e8f0',
    },
    chipActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    chipText: {
        fontWeight: '600',
    },
    chipTextInactive: {
        color: '#475569',
    },
    chipTextActive: {
        color: '#fff',
    },
});
