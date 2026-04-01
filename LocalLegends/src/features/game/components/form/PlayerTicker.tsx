import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { CreateGameFormStyles as styles } from '../themes/CreateGameFormStyles';

interface PlayerTickerProps {
    label: string;
    value: number;
    onValueChange: (value: number) => void;
    min?: number;
    max?: number;
}

export const PlayerTicker: React.FC<PlayerTickerProps> = ({ 
    label, value, onValueChange, min = 2, max = 50 
}) => {
    const handleIncrement = () => {
        onValueChange(Math.min(max, value + 1));
    };

    const handleDecrement = () => {
        onValueChange(Math.max(min, value - 1));
    };

    const handleTextChange = (text: string) => {
        const val = parseInt(text) || 0;
        const clamped = Math.min(max, Math.max(0, val));
        onValueChange(clamped);
    };

    const handleBlur = () => {
        if (value < min) onValueChange(min);
    };

    return (
        <View style={styles.tickerRow}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.tickerControls}>
                <TouchableOpacity 
                    style={styles.tickerButton} 
                    onPress={handleDecrement}>
                    <Text style={styles.tickerButtonText}>-</Text>
                </TouchableOpacity>
                <TextInput 
                    style={styles.tickerValue} 
                    value={String(value)} 
                    onChangeText={handleTextChange}
                    keyboardType="numeric"
                    onBlur={handleBlur}
                />
                <TouchableOpacity 
                    style={styles.tickerButton} 
                    onPress={handleIncrement}>
                    <Text style={styles.tickerButtonText}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
