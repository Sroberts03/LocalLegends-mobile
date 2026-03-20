import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import React, {useEffect} from "react";
import { useFocusEffect } from '@react-navigation/native'; 
import MockGameFacade from '@/src/server/mock/MockGameFacade';
import GameCard from "@/src/components/GameCard";
import GameDetailsModal from "@/src/components/GameDetailsModal";
import { GameWithDetails, GameCreation } from "@/src/models/Game";
import CreateGame from '@/src/components/CreateGame';
import Sport from "@/src/models/Sport";

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

  const handleDeleteDraft = async (gameId: number) => {
    try {
      await server.deleteGame(gameId);
      loadMyGames();
      setGameCreation(null);
    } catch (error) {
      console.error("Failed to delete draft:", error);
    }
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

      {/* Schedule-style layout: Today, This Week, Later */}
      <ScrollView contentContainerStyle={styles.listContent}>
        {myGames.length > 0 ? (
          draftGames ? (
            myGames.map(game => (
              <GameCard 
                key={cardId(game)} 
                game={game} 
                onPress={() => handleGamePress(game)} 
                handleDeleteDraft={handleDeleteDraft}
              />
            ))
          ) : (
            (() => {
              // Categorize games
              const todayGames: (GameWithDetails | GameCreation)[] = [];
              const weekGames: (GameWithDetails | GameCreation)[] = [];
              const laterGames: (GameWithDetails | GameCreation)[] = [];
              const now = new Date();
              const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
              const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
              const endOfWeek = new Date(today);
              endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
              endOfWeek.setHours(23, 59, 59);
              myGames.forEach(game => {
                const start = game.game?.startTime || game.startTime;
                if (!start) return;
                const startDate = new Date(start);
                if (startDate >= today && startDate <= endOfToday) {
                  todayGames.push(game);
                } else if (startDate > endOfToday && startDate <= endOfWeek) {
                  weekGames.push(game);
                } else if (startDate > endOfWeek) {
                  laterGames.push(game);
                }
              });
              return (
                <>
                  {todayGames.length > 0 && (
                    <View style={styles.dateSection}>
                      <Text style={styles.dateHeader}>Today</Text>
                      {todayGames.sort((a, b) => {
                        const aTime = a.game?.startTime || a.startTime;
                        const bTime = b.game?.startTime || b.startTime;
                        return new Date(aTime).getTime() - new Date(bTime).getTime();
                      }).map(game => (
                        <GameCard 
                          key={cardId(game)} 
                          game={game} 
                          onPress={() => handleGamePress(game)} 
                        />
                      ))}
                    </View>
                  )}
                  {weekGames.length > 0 && (
                    <View style={styles.dateSection}>
                      <Text style={styles.dateHeader}>This Week</Text>
                      {weekGames.sort((a, b) => {
                        const aTime = a.game?.startTime || a.startTime;
                        const bTime = b.game?.startTime || b.startTime;
                        return new Date(aTime).getTime() - new Date(bTime).getTime();
                      }).map(game => (
                        <GameCard 
                          key={cardId(game)} 
                          game={game} 
                          onPress={() => handleGamePress(game)} 
                        />
                      ))}
                    </View>
                  )}
                  {laterGames.length > 0 && (
                    <View style={styles.dateSection}>
                      <Text style={styles.dateHeader}>Later</Text>
                      {laterGames.sort((a, b) => {
                        const aTime = a.game?.startTime || a.startTime;
                        const bTime = b.game?.startTime || b.startTime;
                        return new Date(aTime).getTime() - new Date(bTime).getTime();
                      }).map(game => (
                        <GameCard 
                          key={cardId(game)} 
                          game={game} 
                          onPress={() => handleGamePress(game)} 
                        />
                      ))}
                    </View>
                  )}
                </>
              );
            })()
          )
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
    paddingHorizontal: 20,
    paddingBottom: 75,
    alignItems: 'stretch',
  },
  dateSection: {
    marginBottom: 24,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6366f1',
    marginBottom: 8,
    marginTop: 8,
  },
  emptyText: {
    marginTop: 40,
    color: '#9ca3af',
    fontSize: 16,
    alignSelf: 'center',
  }
});