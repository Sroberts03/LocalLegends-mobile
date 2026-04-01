import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/src/themes/themes';
import { CreateGameFormStyles as styles } from '../themes/CreateGameFormStyles';

interface FormSectionHeaderProps {
    title: string;
    icon: React.ComponentProps<typeof Ionicons>['name'];
}

export const FormSectionHeader: React.FC<FormSectionHeaderProps> = ({ title, icon }) => (
    <View style={styles.sectionHeader}>
        <Ionicons name={icon} size={16} color={COLORS.primary} style={{ marginRight: 8 }} />
        <Text style={styles.sectionTitle}>{title}</Text>
    </View>
);
