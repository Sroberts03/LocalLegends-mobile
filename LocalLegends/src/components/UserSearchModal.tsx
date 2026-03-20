import React from 'react';
import { Modal, ScrollView, View, StyleSheet, Pressable } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { ProfileInfo } from "../models/Profile";
import UserProfile from "./UserProfile";

type UserSearchModalProps = {
    visible: boolean;
    handleFollowUnfollowPlayer: (playerId: string) => void;
    handleClose: () => void;
    profileInfo: ProfileInfo | null; 
}

export default function UserSearchModal({ 
    visible, 
    handleFollowUnfollowPlayer, 
    handleClose, 
    profileInfo 
}: UserSearchModalProps) {
    
    // Don't render anything if there's no data
    if (!profileInfo) return null;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true} // Crucial for seeing the screen behind it
            onRequestClose={handleClose} // Handles the Android hardware back button
        >
            {/* Dark semi-transparent background overlay */}
            <View style={styles.modalOverlay}>
                
                {/* The actual white modal card */}
                <View style={styles.modalContent}>
                    
                    {/* Header with Close Button */}
                    <View style={styles.modalHeader}>
                        {/* Little grey drag indicator line (purely visual) */}
                        <View style={styles.dragHandle} /> 
                        
                        <Pressable onPress={handleClose} style={styles.closeButton}>
                            <Ionicons name="close-circle" size={30} color="#9ca3af" />
                        </Pressable>
                    </View>

                    {/* Scrollable Profile Content */}
                    <ScrollView 
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <UserProfile 
                            profile={profileInfo} 
                            handleFollowUnfollow={handleFollowUnfollowPlayer}
                        />
                    </ScrollView>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Darken the screen behind modal
        justifyContent: 'flex-end', // Push the modal to the bottom
    },
    modalContent: {
        backgroundColor: '#f9fafb', // Matching your app's background color
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: '90%', // Don't take up the full screen so they know it's a modal
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    modalHeader: {
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 8,
        position: 'relative',
        zIndex: 1,
    },
    dragHandle: {
        width: 40,
        height: 5,
        backgroundColor: '#d1d5db',
        borderRadius: 3,
        marginBottom: 10,
    },
    closeButton: {
        position: 'absolute',
        top: 12,
        right: 16,
        padding: 4, // Make the touch target a bit bigger
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40, // Extra padding at the bottom for scrolling comfort
    }
});