import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet,  
  ScrollView, 
  TouchableOpacity,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import Profile, { ProfileInfo } from '@/src/models/Profile';
import { GameWithDetails, SearchedGame } from '@/src/models/Game';
import MockSearchFacade from '@/src/server/mock/MockSearchFacade';
import MockProfileFacade from '@/src/server/mock/MockProfileFacade';
import MockGameFacade from '@/src/server/mock/MockGameFacade';
import useUserLocation from '@/src/hooks/useUserLocation';
import useRecentSearches from '@/src/hooks/useRecentSearches';
import GameDetailsModal from '@/src/components/GameDetailsModal';
import UserSearchModal from '@/src/components/UserSearchModal';

const gameState = (game: SearchedGame) => {
  if (game.currentUserHasJoined) return '✓ You\'re in!';
  if (game.currentPlayerCount >= game.maxPlayers) return 'No spots left';
  return 'Spots Available! Join now!';
}

export default function SearchScreen() {
  const server = useMemo(() => new MockSearchFacade(), []);
  const userServer = useMemo(() => new MockProfileFacade(), []);
  const gameServer = useMemo(() => new MockGameFacade(), []);
  
  const { location } = useUserLocation();
  const { recentSearches, addSearch, clearSearches } = useRecentSearches();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All'); 
  const [suggestedPlayers, setSuggestedPlayers] = useState<Profile[]>([]);
  const [trendingGames, setTrendingGames] = useState<SearchedGame[]>([]);
  const [searchResults, setSearchResults] = useState<{ games: SearchedGame[], players: Profile[] }>({ games: [], players: [] });
  
  // Follow/Unfollow State
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());

  // Modal State
  const [gameWithDetails, setGameWithDetails] = useState<GameWithDetails | null>(null);
  const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>(null);

  const tabs = ['All', 'Games', 'People'];

  // Fetch Trending/Suggested Data on Mount
  useEffect(() => {
    let isMounted = true;
    const fetchInitialData = async () => {
      try {
        const lat = location?.latitude || 37.7749;
        const lng = location?.longitude || -122.4194;

        const [players, games] = await Promise.all([
            server.getSuggestedPlayers(lat, lng),
            server.getTrendingGames(lat, lng)
        ]);

        if (isMounted) {
          setSuggestedPlayers(players);
          setTrendingGames(games);
        }
      } catch (error) {
        console.error("Failed to fetch initial search data:", error);
      }
    };
    fetchInitialData();
    return () => { isMounted = false; };
  }, [server, location]);

  // Execute Search
  const onSubmitSearch = async () => {
    if (searchQuery.trim().length > 0) {
        addSearch(searchQuery);
        const results = await server.searchAll(
            searchQuery, 
            { 
                games: activeTab === 'Games' || activeTab === 'All', 
                players: activeTab === 'People' || activeTab === 'All' 
            }, 
            location?.latitude || 0, 
            location?.longitude || 0, 
            20, 
            0
        );
        setSearchResults(results);
    }
  };

  // Logic to toggle follow state
  const handleFollowUnfollowPlayer = (playerId: string) => {
    setFollowedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(playerId)) {
        newSet.delete(playerId);
      } else {
        newSet.add(playerId);
      }
      return newSet;
    });
    console.log('TODO implement follow/unfollow logic with server');
  };

  const handlePlayerPress = async (playerId: string) => {
    const profile = await userServer.getUserProfile(playerId);
    setProfileInfo(profile);
  };

  const handleGamePress = async (gameId: number) => {
    try {
      const gameDetails = await gameServer.getGameDetailsById(gameId);
      setGameWithDetails(gameDetails);
    } catch (error) {
      console.error("Failed to fetch game details:", error);
    }
  };

  const handleJoinOrLeaveGame = async () => {
    if (!gameWithDetails) return;
    if (gameWithDetails.userHasJoined) {
      await gameServer.leaveGame(gameWithDetails.game.id)
    } else {
      await gameServer.joinGame(gameWithDetails.game.id)
    }
    setTrendingGames([...trendingGames.filter(g => g.id !== gameWithDetails.game.id)]);
    setGameWithDetails(null);
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'
    }).format(new Date(date));
  };

  // Reusable Player Card component to handle dynamic button states
  const renderPlayerCard = (player: Profile) => {
    const isFollowing = followedIds.has(player.id);
    return (
      <TouchableOpacity key={player.id} style={styles.playerCard} onPress={() => handlePlayerPress(player.id)}>
        <View style={styles.playerAvatar}>
          <Image source={{ uri: player.profileImageUrl }} style={styles.avatarImage} />
        </View>
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>{player.displayName}</Text>
          <Text style={styles.playerDetail}>Suggested for you</Text>
        </View>
        <TouchableOpacity 
          style={[styles.addButton, isFollowing && styles.followingButton]} 
          onPress={() => handleFollowUnfollowPlayer(player.id)}
        >
          <Text style={[styles.addButtonText, isFollowing && styles.followingButtonText]}>
            {isFollowing ? 'Following' : 'Follow'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header & Search Bar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search games, courts, or players..."
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
            onSubmitEditing={onSubmitSearch}
            returnKeyType="search"
          />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Search Results */}
        {searchQuery !== '' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Search Results</Text>
            {searchResults.games.map(game => (
              <TouchableOpacity key={game.id} style={styles.gameCard} onPress={() => handleGamePress(game.id)}>
                <View style={styles.gameHeader}>
                  <Text style={styles.gameTitle}>{game.name}</Text>
                  <Text style={styles.gameSport}>{game.sportName}</Text>
                </View>
                <Text style={styles.gameLocation}>{game.locationName}</Text>
                <Text style={styles.gameTime}>{formatDate(game.startTime)}</Text>
                <Text style={!game.currentUserHasJoined && game.currentPlayerCount < game.maxPlayers ? styles.invitationText : styles.playerDetail}>{gameState(game)}</Text>
              </TouchableOpacity>
            ))}
            {searchResults.players.map(player => renderPlayerCard(player))}
          </View>
        )}

        {/* Recent Searches */}
        {searchQuery === '' && recentSearches.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent</Text>
              <TouchableOpacity onPress={clearSearches}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            </View>
            {recentSearches.map((item, index) => (
                <TouchableOpacity 
                    key={index} 
                    style={styles.recentItem}
                    onPress={() => {
                        setSearchQuery(item);
                        addSearch(item);
                    }}
                >
                    <Ionicons name="time-outline" size={20} color="#8E8E93" />
                    <Text style={styles.recentText}>{item}</Text>
                </TouchableOpacity>
            ))}
          </View>
        )}
        
        {/* Suggested Players */}
        {(activeTab === 'All' || activeTab === 'People') && suggestedPlayers.length > 0 && searchQuery === '' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Suggested Players</Text>
            {suggestedPlayers.map(player => renderPlayerCard(player))}
          </View>
        )}

        {/* Trending Games */}
        {(activeTab === 'All' || activeTab === 'Games') && trendingGames.length > 0 && searchQuery === '' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trending Nearby</Text>
            {trendingGames.map(game => (
                <TouchableOpacity key={game.id} style={styles.gameCard} onPress={() => handleGamePress(game.id)}>
                    <View style={styles.gameHeader}>
                        <Text style={styles.gameTitle}>{game.name}</Text>
                        <Text style={styles.gameSport}>{game.sportName}</Text>
                    </View>
                    <Text style={styles.gameLocation}>{game.locationName}</Text>
                    <Text style={styles.gameTime}>{formatDate(game.startTime)}</Text>
                </TouchableOpacity>
            ))}
          </View>
        )}

      </ScrollView>

      {/* Modals */}
      <GameDetailsModal
        game={gameWithDetails}
        onClose={() => setGameWithDetails(null)}
        onJoinOrLeave={() => handleJoinOrLeaveGame()}
      />

      <UserSearchModal
        visible={!!profileInfo}
        profileInfo={profileInfo}
        handleClose={() => setProfileInfo(null)}
        handleFollowUnfollowPlayer={handleFollowUnfollowPlayer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFEFF4',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1C1C1E',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  tab: {
    marginRight: 24,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#5C5CBE',
  },
  tabText: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#5C5CBE',
    fontWeight: '700',
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  clearText: {
    color: '#5C5CBE',
    fontSize: 14,
    fontWeight: '500',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  recentText: {
    fontSize: 16,
    color: '#1C1C1E',
    marginLeft: 12,
  },
  gameCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  gameSport: {
    fontSize: 12,
    color: '#5C5CBE',
    backgroundColor: '#EAEAFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  gameLocation: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  gameTime: {
    fontSize: 14,
    color: '#34C759',
    fontWeight: '500',
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  playerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#D1D1D6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden'
  },
  avatarImage: {
    width: 48, 
    height: 48, 
    borderRadius: 24 
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  playerDetail: {
    fontSize: 13,
    color: '#8E8E93',
  },
  invitationText: {
    fontSize: 14,
    color: '#4f46e5',
    fontWeight: '500',
    marginTop: 6,
  },
  addButton: {
    backgroundColor: '#EAEAFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 90,
    alignItems: 'center'
  },
  addButtonText: {
    color: '#5C5CBE',
    fontWeight: '600',
    fontSize: 14,
  },
  followingButton: {
    backgroundColor: '#EFEFF4',
  },
  followingButtonText: {
    color: '#1C1C1E',
  },
});