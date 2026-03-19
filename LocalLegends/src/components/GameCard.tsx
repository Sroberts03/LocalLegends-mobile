import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { GameWithDetails } from "../models/Game";

type GameCardProps = {
  game: GameWithDetails | GameCreation;
  onPress: () => void;
};

export default function GameCard({ game, onPress }: GameCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Text style={styles.gameName}>{game.game?.name || game.gameName}</Text>
      <Text style={styles.sportName}>{game.sportName}</Text>
      <Text style={styles.locationName}>{game.locationName || game.location?.name}</Text>
      <Text style={styles.startTime}>{game.game?.startTime?.toLocaleString() || game.startTime?.toLocaleString()}</Text>
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