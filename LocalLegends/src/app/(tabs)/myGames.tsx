import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import React, {useEffect} from "react";
import { useFocusEffect } from '@react-navigation/native'; 
import MockGameFacade from '@/src/server/mock/MockGameFacade';
import GameCard from "@/src/components/GameCard";
import GameDetailsModal from "@/src/components/GameDetailsModal";
import { GameWithDetails } from "@/src/models/Game";
import CreateGame from '@/src/components/CreateGame';

export default function MyGamesScreen() {
  const server = React.useMemo(() => new MockGameFacade(), []);
  const [myGames, setMyGames] = React.useState<GameWithDetails[] | GameCreation[]>([]);
  const [gameToCheckout, setGameToCheckout] = React.useState<GameWithDetails | null>(null);
  const [gameCreation, setGameCreation] = React.useState<GameWithDetails | null>(null);
  const [draftGames, setDraftGames] = React.useState<boolean>(false);
  const [sports, setSports] = React.useState<Sport[]>([]);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const sportsData = await server.getSports();
        setSports(sportsData);
      } catch (error) {
        console.error("Failed to fetch sports:", error);
      }
    };

    fetchSports();
  }, [server]);

  const loadMyGames = React.useCallback(async () => {
    try {
      const games = draftGames 
        ? await server.listMyDraftGames() 
        : await server.listMyActiveGames();
      setMyGames(games);
    } catch (error) {
      console.error("Failed to fetch games:", error);
    }
  }, [server, draftGames]);

  useFocusEffect(
    React.useCallback(() => {
      loadMyGames();
    }, [loadMyGames])
  );

  const handleLeave = async (gameId: number) => {
    try {
      await server.leaveGame(gameId);
      loadMyGames();
      setGameToCheckout(null);
    } catch (error) {
      console.error("Failed to leave game:", error);
    }
  };

  const handleGamePress = (game: GameWithDetails | GameCreation) => {
    if (draftGames) {
      setGameCreation(game);
      return;
    }
    setGameToCheckout(game);
  };

  const cardId = (game: GameWithDetails | GameCreation) => {
    if ('game' in game) {
      return game.game.id;
    }
    return game.id;
  }

  const handleGameCreation = async (gameCreation: GameCreation) => {
    await server.updateGame(gameCreation);
    loadMyGames();
  }

  return (
    <View style={styles.container}>
      {/* Tab Header Area */}
      <View style={styles.header}>
        <Text style={styles.title}>My Games</Text>
        <View style={styles.tabContainer}>
          <Pressable 
            onPress={() => setDraftGames(false)} 
            style={[styles.tabButton, !draftGames && styles.activeTabButton]}
          >
            <Text style={[styles.tabButtonText, !draftGames && styles.activeTabButtonText]}>
              Active
            </Text>
          </Pressable>

          <Pressable 
            onPress={() => setDraftGames(true)} 
            style={[styles.tabButton, draftGames && styles.activeTabButton]}
          >
            <Text style={[styles.tabButtonText, draftGames && styles.activeTabButtonText]}>
              Drafts
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Game List */}
      <ScrollView contentContainerStyle={styles.listContent}>
        {myGames.length > 0 ? (
          myGames.map(game => (
            <GameCard 
              key={cardId(game)} 
              game={game} 
              onPress={() => handleGamePress(game)} 
            />
          ))
        ) : (
          <Text style={styles.emptyText}>No {draftGames ? 'draft' : 'active'} games found.</Text>
        )}
      </ScrollView>

      <GameDetailsModal
        game={gameToCheckout}
        onClose={() => setGameToCheckout(null)}
        onJoinOrLeave={handleLeave}
      />

      <CreateGame
        visible={!!gameCreation}
        existingGame={gameCreation}
        onClose={() => setGameCreation(null)}
        handleGameCreation={handleGameCreation}
        sports={sports}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb', 
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 15,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabButtonText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabButtonText: {
    color: '#6366f1',
  },
  listContent: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 40,
    color: '#9ca3af',
    fontSize: 16,
  }
});