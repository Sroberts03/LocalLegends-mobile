import MapView, { Marker } from 'react-native-maps';
import React, { useEffect, useState, useCallback } from 'react';
import { Pressable, StyleSheet, View, Text, ActivityIndicator, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

// Models & Facades
import { GameCreation, GameFilter, GameWithDetails, AccessType } from '@/src/models/Game';
import Sport from '@/src/models/Sport';
import MockGameFacade from '@/src/server/mock/MockGameFacade';

// Components
import FilterModal from '@/src/components/FilterModal';
import CreateGame from '@/src/components/CreateGame';
import GameDetailsModal from '@/src/components/GameDetailsModal';

// Hooks
import useUserLocation from '@/src/hooks/useUserLocation';

const DEFAULT_REGION = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const getMarkerColor = (sportName: string) => {
  switch (sportName.toLowerCase()) {
    case 'basketball':
      return '#f97316';
    case 'soccer':
      return '#22c55e';
    case 'american football':
      return '#3b82f6';
    default:
      return '#8b5cf6';
  }
};

const getSportIcon = (sportName: string) => {
  switch (sportName.toLowerCase()) {
    case 'basketball':
      return 'basketball-outline';
    case 'soccer':
      return 'football-outline';
    case 'american football':
      return 'american-football-outline';
    default:
      return 'location-outline';
  }
};

const lastUpdatedDate = (lastUpdated: Date | null, now: Date) => {
    if (!lastUpdated) return "Never";
    const diffMs = now.getTime() - lastUpdated.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};

const getOffsetCoordinates = (games: GameWithDetails[]) => {
  const coordCounts = new Map<string, number>();

  return games.map((game) => {
    const key = `${game.latitude},${game.longitude}`;
    const count = coordCounts.get(key) || 0;
    coordCounts.set(key, count + 1);

    if (count > 0) {
      const angle = (count * 137.5) * (Math.PI / 180); 
      const radius = 0.0001 * count; 
      return {
        ...game,
        latitude: game.latitude + radius * Math.cos(angle),
        longitude: game.longitude + radius * Math.sin(angle),
      };
    }
    return game;
  });
};

export default function MapScreen() {
  const server = React.useMemo(() => new MockGameFacade(), []);
  
  // Consume the custom hook, including the loading state for location fetching
  const { location, fetchLocation, isLoading: isLocationLoading } = useUserLocation();
  
  const mapRef = React.useRef<any>(null);
  const [games, setGames] = useState<GameWithDetails[]>([]);
  const [filters, setFilters] = useState<GameFilter>({ latitude: 0, longitude: 0, maxDistance: 25 });
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [createGameVisible, setCreateGameVisible] = useState(false);
  const [sports, setSports] = useState<Sport[]>([]);
  
  // State for data loading and initial load blocking
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [gameToCheckout, setGameToCheckout] = useState<GameWithDetails | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [now, setNow] = useState(new Date());
  const [showLastUpdated, setShowLastUpdated] = useState(false);
  const pillOpacity = React.useRef(new Animated.Value(1)).current;

  // Time tracker for "Last Updated" pill
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Show pill and auto-hide after refresh
  useEffect(() => {
    if (lastUpdated) {
      setShowLastUpdated(true);
      pillOpacity.setValue(1);
      const timeout = setTimeout(() => {
        Animated.timing(pillOpacity, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }).start(() => setShowLastUpdated(false));
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [lastUpdated, pillOpacity]);

  // React to Location Changes (from the hook)
  useEffect(() => {
    if (location) {
        setFilters(prev => ({ 
            ...prev, 
            latitude: location.latitude, 
            longitude: location.longitude 
        }));

        if (mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            }, 1000);
        }
    }
  }, [location]);

  const mapRegion = location
    ? {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : DEFAULT_REGION;

  const loadData = useCallback(async () => {
    // Prevent fetching if we don't have real coordinates yet
    if (filters.latitude === 0 && filters.longitude === 0) return;

    setIsLoading(true);
    try {
      const serverGames = await server.listGames(filters);
      const serverSports = await server.getSports();
      setSports(serverSports);
      setGames(serverGames);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to refresh games:", error);
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false); // Turn off the initial load flag forever
    }
  }, [filters, server]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleGameCreation = async (gameCreation: GameCreation) => {
    await server.createGame(gameCreation);
    loadData(); // Refresh list after creating
  }

  const handleJoinGame = async (gameId: number) => {
    await server.joinGame(gameId);
    setGameToCheckout(null);
    loadData(); // Refresh list after joining
  }

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  const isPrivate = (game: GameWithDetails) => {
    if (!game) return false;
    return game.game.accessType === AccessType.Private;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        showsUserLocation
        showsPointsOfInterest={false}
        pitchEnabled={false}
        ref={mapRef}
        initialRegion={mapRegion}
      >
        {getOffsetCoordinates(games).map(game => (
            <Marker
              key={game.game.id}
              coordinate={{ latitude: game.latitude, longitude: game.longitude }}
              title={game.game.name}
              description={game.locationName + ' - ' + dateFormatter.format(game.game.startTime)}
              anchor={{ x: 0.5, y: 1 }}
              onCalloutPress={() => setGameToCheckout(game)}
            >
              <View style={styles.markerWrap}>
                <View style={[styles.markerHead, { backgroundColor: getMarkerColor(game.sportName) }]}>
                  <Ionicons name={getSportIcon(game.sportName)} size={16} color="#ffffff" />
                  {isPrivate(game) && (
                    <View style={styles.lockBadge}>
                      <Ionicons name="key" size={10} color="#ffffff" />
                    </View>
                  )}
                </View>
                <View style={[styles.markerTip, { borderTopColor: getMarkerColor(game.sportName) }]} />
              </View>
            </Marker>
        ))}
      </MapView>

      {/* Full-screen loading overlay only shows on the very first load */}
      {(isLoading && isInitialLoad) && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingSpinnerContainer}>
            <ActivityIndicator size="large" color="#6366f1" style={{ marginBottom: 16 }} />
            <Text style={styles.loadingText}>
                Loading games...
            </Text>
          </View>
        </View>
      )}

      {showLastUpdated && (
        <Animated.View style={[styles.lastUpdatedContainer, { opacity: pillOpacity }]}> 
          <Text style={styles.lastUpdatedText}>
            Last Updated: {lastUpdatedDate(lastUpdated, now)}
          </Text>
        </Animated.View>
      )}

      <View style={styles.actionPillar}>
        {/* Refresh Button with Spinner */}
        <Pressable onPress={loadData} disabled={isLoading}>
          <BlurView intensity={65} tint="light" style={styles.glassActionButton}>
            {isLoading && !isInitialLoad ? (
              <ActivityIndicator size="small" color="#111827" />
            ) : (
              <Ionicons name="refresh" color="#111827" size={22} />
            )}
          </BlurView>
        </Pressable>

        {/* Options Button */}
        <Pressable onPress={() => setFiltersVisible(true)}>
          <BlurView intensity={65} tint="light" style={styles.glassActionButton}>
            <Ionicons name="options-outline" color="#111827" size={22} />
          </BlurView>
        </Pressable>

        {/* Locate Button with Spinner */}
        <Pressable onPress={fetchLocation} disabled={isLocationLoading}>
          <BlurView intensity={65} tint="light" style={styles.glassActionButton}>
            {isLocationLoading ? (
              <ActivityIndicator size="small" color="#111827" />
            ) : (
              <Ionicons name="locate" color="#111827" size={22} />
            )}
          </BlurView>
        </Pressable>
      </View>

      <Pressable style={styles.newGameButton} onPress={() => setCreateGameVisible(true)}>
        <Ionicons name="add" color="#fff" size={24} />
      </Pressable>

      <FilterModal
        visible={filtersVisible}
        filters={filters}
        onClose={() => setFiltersVisible(false)}
        onApply={(updates) => {
          setFilters((prev) => ({ ...prev, ...updates }));
          setFiltersVisible(false);
        }}
        sports={sports}
      />

      <CreateGame
        visible={createGameVisible}
        onClose={() => setCreateGameVisible(false)}
        sports={sports}
        handleGameCreation={handleGameCreation}
      />

      <GameDetailsModal
        game={gameToCheckout}
        onClose={() => setGameToCheckout(null)}
        onJoinOrLeave={handleJoinGame}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  lockBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#facc15', 
    borderRadius: 9,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    borderWidth: 1.5,
    borderColor: '#ffffff', 
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    backgroundColor: 'rgba(30, 41, 59, 0.38)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingSpinnerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 8,
    textShadowColor: 'rgba(255,255,255,0.18)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  container: {
    flex: 1,
  },
  actionPillar: {
    position: 'absolute',
    right: 16,
    top: 70,
    gap: 12,
  },
  glassActionButton: {
    height: 52,
    width: 52,
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  newGameButton: {
    position: 'absolute',
    right: 16,
    bottom: 105,
    backgroundColor: '#6366f1',
    padding: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderRadius: 999,
  },
  markerWrap: {
    alignItems: 'center',
  },
  markerHead: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  markerTip: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1,
  },
  lastUpdatedContainer: {
    position: 'absolute',
    left: 16,
    top: 70,
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lastUpdatedText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
});