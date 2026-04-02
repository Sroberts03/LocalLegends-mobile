import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Platform, TouchableWithoutFeedback } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '@/src/themes/themes';

interface DateTimePickerModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: (date: Date) => void;
    value: Date;
    mode: 'datetime' | 'date' | 'time';
    title: string;
}

export const DateTimePickerModal: React.FC<DateTimePickerModalProps> = ({ 
    visible, onClose, onConfirm, value, mode, title 
}) => {
    const [tempDate, setTempDate] = useState<Date>(value);

    // Sync temp date with props when modal opens
    React.useEffect(() => {
        if (visible) {
            setTempDate(value);
        }
    }, [visible, value]);

    const handleConfirm = () => {
        onConfirm(tempDate);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback onPress={() => {}}>
                        <View style={styles.content}>
                            <View style={styles.header}>
                                <TouchableOpacity onPress={onClose}>
                                    <Text style={styles.cancelText}>Cancel</Text>
                                </TouchableOpacity>
                                <Text style={styles.titleText}>{title}</Text>
                                <TouchableOpacity onPress={handleConfirm}>
                                    <Text style={styles.doneText}>Done</Text>
                                </TouchableOpacity>
                            </View>
                            
                            <View style={styles.pickerContainer}>
                                <DateTimePicker
                                    value={tempDate}
                                    mode={mode}
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={(event, date) => {
                                        if (date) setTempDate(date);
                                    }}
                                    textColor="#000"
                                    style={{ width: '100%' }}
                                />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    content: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#edf2f7',
    },
    cancelText: {
        color: '#718096',
        fontSize: 16,
        fontWeight: '500',
    },
    doneText: {
        color: '#3b82f6',
        fontSize: 16,
        fontWeight: '600',
    },
    titleText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1a202c',
    },
    pickerContainer: {
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
