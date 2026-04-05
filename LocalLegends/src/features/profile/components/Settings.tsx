import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/src/themes/themes';
import { AuthApi } from '@/src/features/auth/api/AuthApi';
import { styles } from '@/src/features/profile/themes/SettingsTheme';
import { useRouter } from 'expo-router';
import { checkNotificationPermissions, registerForPushNotificationsAsync } from '@/src/utils/notificationUtils';

const SettingRow = ({ 
    icon, 
    label, 
    onPress, 
    showSwitch, 
    switchValue, 
    onToggle 
}: { 
    icon: any, 
    label: string, 
    onPress?: () => void, 
    showSwitch?: boolean, 
    switchValue?: boolean,
    onToggle?: (val: boolean) => void
}) => (
    <TouchableOpacity 
        style={styles.row} 
        onPress={onPress} 
        disabled={showSwitch}
        activeOpacity={0.7}
    >
        <View style={styles.rowLeft}>
            <View style={styles.iconBackground}>
                <Ionicons name={icon} size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.label}>{label}</Text>
        </View>
        {showSwitch ? (
            <Switch 
                value={switchValue} 
                onValueChange={onToggle}
                trackColor={{ false: '#e2e8f0', true: '#93c5fd' }}
                thumbColor={switchValue ? COLORS.primary : '#f8fafc'}
            />
        ) : (
            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
        )}
    </TouchableOpacity>
);

const SectionHeader = ({ title }: { title: string }) => (
    <Text style={styles.sectionTitle}>{title}</Text>
);

export default function Settings() {
    const [pushEnabled, setPushEnabled] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkStatus = async () => {
            const isEnabled = await checkNotificationPermissions();
            setPushEnabled(isEnabled);
        };
        checkStatus();
    }, []);

    const handlePushToggle = async (value: boolean) => {
        if (value) {
            const token = await registerForPushNotificationsAsync();
            if (token) {
                setPushEnabled(true);
            } else {
                // If it fails (user denied), we might want to show an alert or just keep it off
                setPushEnabled(false);
            }
        } else {
            // For now just toggle UI, real unregister would involve server logic
            setPushEnabled(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <SectionHeader title="Account Settings" />
            <View style={styles.card}>
                <SettingRow 
                    icon="person-outline" 
                    label="Edit Profile" 
                    onPress={() => {router.push('/editProfile') }}
                />
                <SettingRow 
                    icon="shield-checkmark-outline" 
                    label="Security & Password" 
                    onPress={() => {alert("TODO: Security & Password") }}
                />
                <SettingRow 
                    icon="notifications-outline" 
                    label="Push Notifications" 
                    showSwitch 
                    switchValue={pushEnabled} 
                    onToggle={handlePushToggle} 
                />
            </View>

            <SectionHeader title="Support & Legal" />
            <View style={styles.card}>
                <SettingRow 
                    icon="help-circle-outline" 
                    label="Help Center" 
                    onPress={() => {alert("TODO: Help Center") }}
                />
                <SettingRow 
                    icon="document-text-outline" 
                    label="Privacy Policy" 
                    onPress={() => {alert("TODO: Privacy Policy") }}
                />
                <SettingRow 
                    icon="information-circle-outline" 
                    label="Terms of Service" 
                    onPress={() => {alert("TODO: Terms of Service") }}
                />
            </View>

            <TouchableOpacity 
                style={styles.logoutButton} 
                onPress={AuthApi.logout}
                activeOpacity={0.8}
            >
                <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.logoutButton} 
                onPress={() => {alert("TODO: Delete Account")}}
                activeOpacity={0.8}
            >
                <Ionicons name="trash-outline" size={20} color="#ef4444" />
                <Text style={styles.logoutText}>Delete Accoun</Text>
            </TouchableOpacity>

            <Text style={styles.versionText}>Local Legends v1.0.4 (Beta)</Text>
        </ScrollView>
    );
}