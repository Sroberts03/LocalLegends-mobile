import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { GameFilter, GameWithDetails } from '@/src/models/Game';
import MockGameFacade from '@/src/server/mock/MockGameFacade';

export default function MapScreen() {
  const server = React.useMemo(() => new MockGameFacade(), []);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const mapRef = React.useRef<MapView>(null);
  const [games, setGames] = useState<GameWithDetails[]>([]);
  const [filters, setFilters] = useState<GameFilter>({ latitude: 0, longitude: 0, maxDistance: 0 });

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

    const loadGames = async () => {
      const serverGames = await server.listGames(filters);
      if (isMounted) {
        setGames(serverGames);
      }
    };

    loadGames();

    return () => {
      isMounted = false;
    };
  }, [filters, server]);

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        showsUserLocation
        ref={mapRef}
        region={
          location
            ? {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }
            : undefined
        } 
      >
        {games.map((game) => (
          <Marker
            key={game.game.id}
            coordinate={{ latitude: game.latitude, longitude: game.longitude }}
            title={game.game.name}
            description={game.locationName}
          />
        ))}
      </MapView>

      <View style={styles.actionPillar}>
        <Pressable onPress={() => alert('Filter legends')}>
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
});