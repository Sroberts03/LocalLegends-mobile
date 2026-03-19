import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { GameWithDetails } from "../models/Game";

type GameCardProps = {
  game: GameWithDetails | GameCreation;
  onPress: () => void;
  handleDeleteDraft?: (gameId: number) => void;
};

const sportIcon = (sportName: string) => {
  if (!sportName) return null;
  switch (sportName.toLowerCase()) {
    case 'american football':
      return 'american-football';
    case 'basketball':
      return 'basketball';
    case 'soccer':
      return 'football';
    default:
      return 'star';
  }
};

const formatGameTime = (startTime: Date | undefined) => {
  if (!startTime) return '';
  const now = new Date();
  const date = new Date(startTime);
  const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
  };
  if (isToday) {
    return `Today, ${date.toLocaleTimeString([], options)}`;
  }
  // Calculate end of this week
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
  endOfWeek.setHours(23, 59, 59);
  if (date <= endOfWeek) {
    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return `${weekDays[date.getDay()]}, ${date.toLocaleTimeString([], options)}`;
  }
  // Show Month Day, HH:MM AM/PM for later
  const month = date.toLocaleString('default', { month: 'short' });
  return `${month} ${date.getDate()}, ${date.toLocaleTimeString([], options)}`;
};

export default function GameCard({ game, onPress, handleDeleteDraft }: GameCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.cardContent}>
        {/* Left Side: Info */}
        <View style={styles.info}>
          <Text style={styles.gameName}>{game.game?.name || game.gameName}</Text>
          <Text style={styles.sportName}>{game.sportName}</Text>
          <Text style={styles.startTime}>{formatGameTime(game.game?.startTime || game.startTime)}</Text>
        </View>

        {/* Right Side: Actions & Icon */}
        <View style={styles.rightPillar}>
          {handleDeleteDraft && (
            <Pressable 
              onPress={() => handleDeleteDraft(game.game?.id || game.id)} 
              style={styles.deleteCircle}
            >
              <Ionicons name="trash-outline" size={18} color="#ef4444" />
            </Pressable>
          )}
          <Ionicons 
            name={sportIcon(game?.sportName)} 
            size={32} 
            color="#6366f1" 
          />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16, // Softer corners
    padding: 16,
    marginVertical: 8,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Vertically centers everything in the row
  },
  info: {
    flex: 1,
    gap: 2, // Consistent spacing between lines
  },
  rightPillar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // Spaces the trash can and sport icon
  },
  deleteCircle: {
    backgroundColor: '#fee2e2',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1e293b',
  },
  sportName: {
    fontSize: 14,
    color: '#64748b',
  },
  startTime: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
});