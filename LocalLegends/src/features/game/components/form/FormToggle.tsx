import React from 'react';
import { View, Text, Switch } from 'react-native';
import { COLORS } from '@/src/themes/themes';
import { CreateGameFormStyles as styles } from '../themes/CreateGameFormStyles';

interface FormToggleProps {
    title: string;
    description: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
}

export const FormToggle: React.FC<FormToggleProps> = ({ title, description, value, onValueChange }) => (
    <View style={styles.toggleRow}>
        <View style={styles.toggleLabelGroup}>
            <Text style={styles.toggleTitle}>{title}</Text>
            <Text style={styles.toggleDescription}>{description}</Text>
        </View>
        <Switch 
            value={value} 
            onValueChange={onValueChange} 
            trackColor={{ false: '#cbd5e0', true: COLORS.primary }}
            thumbColor="#fff"
        />
    </View>
);
