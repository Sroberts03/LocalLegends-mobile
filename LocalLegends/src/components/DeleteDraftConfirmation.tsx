import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

type DeleteDraftConfirmationProps = {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DeleteDraftConfirmation({ visible, onConfirm, onCancel }: DeleteDraftConfirmationProps) {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
        >
            <View style={styles.overlay}>
                <View style={styles.alertBox}>
                    <Text style={styles.modalTitle}>Delete Draft?</Text>
                    <Text style={styles.modalMessage}>
                        Are you sure you want to delete this draft?
                    </Text>
                    <Text style={styles.modalWarning}>
                        This action cannot be undone.
                    </Text>

                    <View style={styles.buttonContainer}>
                        <Pressable 
                            onPress={onCancel} 
                            style={({ pressed }) => [
                                styles.button, 
                                styles.cancelButton,
                                pressed && styles.buttonPressed
                            ]}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </Pressable>
                        
                        <Pressable 
                            onPress={onConfirm} 
                            style={({ pressed }) => [
                                styles.button, 
                                styles.deleteButton,
                                pressed && styles.buttonPressed
                            ]}
                        >
                            <Text style={styles.deleteText}>Delete</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dims the background
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertBox: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        // Shadow for Android
        elevation: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 8,
    },
    modalMessage: {
        fontSize: 16,
        color: '#4b5563',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 4,
    },
    modalWarning: {
        fontSize: 13,
        color: '#ef4444',
        fontWeight: '500',
        marginBottom: 24,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
    },
    button: {
        flex: 1,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonPressed: {
        opacity: 0.7,
    },
    cancelButton: {
        backgroundColor: '#f3f4f6',
    },
    deleteButton: {
        backgroundColor: '#ef4444',
    },
    cancelText: {
        color: '#4b5563',
        fontSize: 16,
        fontWeight: '600',
    },
    deleteText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});