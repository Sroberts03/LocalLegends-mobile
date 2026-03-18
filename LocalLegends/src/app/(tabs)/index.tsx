import MapView, { Marker }from 'react-native-maps';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { GameFilter, GameWithDetails } from '@/src/models/Game';
import Sport from '@/src/models/Sport';
import MockGameFacade from '@/src/server/mock/MockGameFacade';
import FilterModal from '@/src/components/FilterModal';

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

export default function MapScreen() {
  const server = React.useMemo(() => new MockGameFacade(), []);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const mapRef = React.useRef<any>(null);
  const [games, setGames] = useState<GameWithDetails[]>([]);
  const [filters, setFilters] = useState<GameFilter>({ latitude: 0, longitude: 0, maxDistance: 0 });
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [sports, setSports] = useState<Sport[]>([]);
  const mapRegion = location
    ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : DEFAULT_REGION;

  const refreshLocation = async () => {
    let loc = await Location.getCurrentPositionAsync({});
    setLocation(loc);

    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }, 1000);
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      setFilters(prev => ({ ...prev, latitude: loc.coords.latitude, longitude: loc.coords.longitude, maxDistance: 25 }));
    })();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      const serverGames = await server.listGames(filters);
      const serverSports = await server.getSports();
      if (isMounted) {
        setSports(serverSports);
        setGames(serverGames);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [filters, server]);

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        showsUserLocation
        showsPointsOfInterest={false}
        poiEnabled={false}
        ref={mapRef}
        initialRegion={mapRegion}
      >
        {games.map(game => (
          <Marker
            key={game.game.id}
            coordinate={{ latitude: game.latitude, longitude: game.longitude }}
            title={game.game.name}
            description={game.locationName}
          anchor={{ x: 0.5, y: 1 }}
        >
          <View style={styles.markerWrap}>
            <View style={[styles.markerHead, { backgroundColor: getMarkerColor(game.sportName) }]}>
              <Ionicons name={getSportIcon(game.sportName)} size={16} color="#ffffff" />
            </View>
            <View style={[styles.markerTip, { borderTopColor: getMarkerColor(game.sportName) }]} />
          </View>
        </Marker>
        ))}
      </MapView>

      <View style={styles.actionPillar}>
        <Pressable onPress={() => setFiltersVisible(true)}>
          <BlurView intensity={65} tint="light" style={styles.glassActionButton}>
            <Ionicons name="options-outline" color="#111827" size={22} />
          </BlurView>
        </Pressable>

        <Pressable onPress={refreshLocation}>
          <BlurView intensity={65} tint="light" style={styles.glassActionButton}>
            <Ionicons name="locate" color="#111827" size={22} />
          </BlurView>
        </Pressable>
      </View>

      <Pressable style={styles.newGameButton} onPress={() => alert('Add new legend')}>
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
    </View>
  );
}

const styles = StyleSheet.create({
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
});