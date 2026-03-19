import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { GameWithDetails } from "../models/Game";

type GameCardProps = {
  game: GameWithDetails | GameCreation;
  onPress: () => void;
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

export default function GameCard({ game, onPress }: GameCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={styles.gameName}>{game.game?.name || game.gameName}</Text>
          <Text style={styles.sportName}>{game.sportName}</Text>
          <Text style={styles.locationName}>{game.locationName || game.location?.name}</Text>
          <Text style={styles.startTime}>{formatGameTime(game.game?.startTime || game.startTime)}</Text>
        </View>
        <Ionicons name={sportIcon(game?.sportName)} size={40} color="#6366f1" style={styles.icon} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 16,
  },
  info: {
    flex: 1,
  },
  gameName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sportName: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  locationName: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  startTime: {
    fontSize: 12,
    color: '#777',
  },
});