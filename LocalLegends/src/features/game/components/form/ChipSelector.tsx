import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { CreateGameFormStyles as styles } from '../themes/CreateGameFormStyles';

interface ChipSelectorProps {
    label: string;
    data: any[];
    selectedValue: any;
    onSelect: (value: any) => void;
    labelExtractor?: (item: any) => string;
    valueExtractor?: (item: any) => any;
}

export const ChipSelector: React.FC<ChipSelectorProps> = ({ 
    label, data, selectedValue, onSelect, 
    labelExtractor = (i) => i, valueExtractor = (i) => i 
}) => {
    return (
        <View style={styles.chipGroupContainer}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.sportChips}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} nestedScrollEnabled={true}>
                    {data.map((item) => {
                        const labelValue = labelExtractor(item);
                        const dataValue = valueExtractor(item);
                        const isActive = selectedValue === dataValue;
                        
                        return (
                            <TouchableOpacity 
                                key={String(dataValue)}
                                onPress={() => onSelect(dataValue)} 
                                style={[styles.sportChip, isActive && styles.sportChipActive]}
                            >
                                <Text style={[styles.sportChipText, isActive && styles.sportChipTextActive]}>
                                    {labelValue}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>
        </View>
    );
};
