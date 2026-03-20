import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        {/* Left Side: Back Button */}
        <Pressable onPress={() => router.back()} style={styles.headerSide}>
          <Ionicons name="chevron-back" size={28} color="#111827" />
        </Pressable>

        {/* Center: The Title */}
        <Text style={styles.headerTitle}>Notifications</Text>

        {/* Right Side: The Invisible Counterweight */}
        <View style={styles.headerSide} /> 
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerSide: {
    width: 40, 
    alignItems: 'flex-start', 
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center', 
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
});