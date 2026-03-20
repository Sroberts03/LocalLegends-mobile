import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { GameWithDetails, GameStatus } from "../models/Game";
import DeleteDraftConfirmation from "./DeleteDraftConfirmation";

type GameCardProps = {
  game: GameWithDetails | any; // 'any' or 'GameCreation' depending on your imports
  onPress: () => void;
  handleDeleteDraft?: (gameId: number) => void;
};

const sportIcon = (sportName: string, status: GameStatus) => {
  if (!sportName) return 'star';
  switch (sportName.toLowerCase()) {
    case 'american football': return 'american-football';
    case 'basketball': return 'basketball';
    case 'soccer': return 'football';
    default: return 'star';
  }
};

const formatGameTime = (startTime: Date | undefined) => {
  if (!startTime) return '';
  const now = new Date();
  const date = new Date(startTime);
  const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  const options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit' };
  
  if (isToday) return `Today, ${date.toLocaleTimeString([], options)}`;
  
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
  endOfWeek.setHours(23, 59, 59);
  
  if (date <= endOfWeek) {
    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return `${weekDays[date.getDay()]}, ${date.toLocaleTimeString([], options)}`;
  }
  
  const month = date.toLocaleString('default', { month: 'short' });
  return `${month} ${date.getDate()}, ${date.toLocaleTimeString([], options)}`;
};

export default function GameCard({ game, onPress, handleDeleteDraft }: GameCardProps) {
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = React.useState(false);

  // Safely extract properties whether it's a Draft (GameCreation) or an active Game (GameWithDetails)
  const gameName = game.game?.name || game.gameName;
  const startTime = game.game?.startTime || game.startTime;
  const locationName = game.locationName; // Will be undefined for drafts, which is fine

  return (
    <View style={{width: '100%'}}>
      <Pressable onPress={onPress} style={styles.card}>
        <View style={styles.cardContent}>
          {/* Left Side: Info */}
          <View style={styles.info}>
            <Text style={styles.gameName} numberOfLines={1}>{gameName}</Text>
            
            <View style={styles.subtextRow}>
              <Text style={styles.sportName}>{game.sportName}</Text>
              {/* Only show location if it exists (i.e., not a draft) */}
              {locationName && (
                <>
                  <Text style={styles.dotSeparator}>•</Text>
                  <Text style={styles.locationName} numberOfLines={1}>{locationName}</Text>
                </>
              )}
            </View>

            <Text style={styles.startTime}>
              <Ionicons name="time-outline" size={12} /> {formatGameTime(startTime)}
            </Text>
          </View>

          {/* Right Side: Actions & Icon */}
          <View style={styles.rightPillar}>
            {handleDeleteDraft && (
              <Pressable 
                onPress={() => setDeleteConfirmationVisible(true)} 
                style={styles.deleteCircle}
              >
                <Ionicons name="trash-outline" size={18} color="#ef4444" />
              </Pressable>
            )}
            {!handleDeleteDraft && (
              <View style={game?.status === 'draft' ? null : styles.iconCircle}>
                <Ionicons name={sportIcon(game?.sportName, game?.status)} size={24} color="#6366f1" />
              </View>
            )}
          </View>
        </View>
      </Pressable>

      <DeleteDraftConfirmation
        visible={deleteConfirmationVisible}
        onConfirm={() => {
          if (handleDeleteDraft) {
            handleDeleteDraft(game.game?.id || game.id);
          }
          setDeleteConfirmationVisible(false);
        }}
        onCancel={() => setDeleteConfirmationVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16, 
    padding: 16,
    marginVertical: 6, // Slightly tighter vertical margin
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
    alignItems: 'center',
  },
  info: {
    flex: 1,
    gap: 4, // Slightly increased gap for readability
    paddingRight: 12, // Ensure text doesn't overlap the icon
  },
  subtextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  rightPillar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    backgroundColor: '#e0e7ff', // Soft indigo background behind the icon
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
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
    color: '#6366f1', // Colored sport name
    fontWeight: '500',
  },
  dotSeparator: {
    marginHorizontal: 6,
    color: '#cbd5e1',
    fontSize: 14,
  },
  locationName: {
    fontSize: 13,
    color: '#64748b',
    flexShrink: 1, // Allows location to truncate if it gets too long
  },
  startTime: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 2,
    fontWeight: '500',
  },
});