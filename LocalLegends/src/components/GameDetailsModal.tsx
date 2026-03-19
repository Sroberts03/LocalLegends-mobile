import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { GameWithDetails } from '../models/Game';

type GameDetailsModalProps = {
  game: GameWithDetails | null;
  onClose: () => void;
  onJoinOrLeave: (gameId: number) => void;
};

const formatCalendarDate = (dateValue: Date) => {
  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return 'Unknown';
  }

  return parsedDate.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

const formatClockTime = (dateValue: Date) => {
  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return 'Unknown';
  }

  return parsedDate.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
};

const toTitleCase = (value: string) => {
  return value
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

function getSkillBadgeColor(skillLevel: string) {
  switch (skillLevel.toLowerCase()) {
    case 'beginner':
      return '#3b82f6'; // blue
    case 'intermediate':
      return '#007a78'; // yellow
    case 'advanced':
      return '#14b8a6'; // teal
    case 'all':
      return '#6b7280'; // gray
    default:
      return '#14b8a6';
  }
}

export default function GameDetailsModal({ game, onClose, onJoinOrLeave }: GameDetailsModalProps) {
  if (!game) {
    return null;
  }

  const playerProgress = Math.min(game.game.currentPlayerCount / game.game.maxPlayers, 1);

  return (
    <Modal
      visible={Boolean(game)}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.closeIconButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="#374151" />
        </Pressable>
        <View style={styles.sheet}>
          <ScrollView style={styles.scrollContent}>
            <Text style={styles.title}>{game.game.name}</Text>
            <Text style={styles.subtitle}>{game.sportName}</Text>
            <View style={styles.headerRow}>
              <Text style={styles.scheduleText}>
                {formatCalendarDate(game.game.startTime)} at {formatClockTime(game.game.startTime)} until {formatClockTime(game.game.endTime)}
              </Text>
            </View>
            <View style={[styles.skillBadge, { backgroundColor: getSkillBadgeColor(game.game.skillLevel) }]}>
                <Text style={styles.skillBadgeText}>{toTitleCase(game.game.skillLevel)}</Text>
            </View>
            {game.game.description ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.scheduleText}>{game.game.description}</Text>
              </View>
            ) : null}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Players</Text>
              <View style={styles.playerHeaderRow}>
                <Text style={styles.playerSummaryText}>{game.game.currentPlayerCount} / {game.game.maxPlayers} joined</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${playerProgress * 100}%` }]} />
              </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Location</Text>
                <Text style={styles.scheduleText}>{game.locationName}</Text>
            </View>

            {game.latitude && game.longitude ? (
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: game.latitude,
                  longitude: game.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
                rotateEnabled={false}
                pitchEnabled={false}
              >
                <Marker
                  coordinate={{ latitude: game.latitude, longitude: game.longitude }}
                  title={game.game.name}
                  description={game.locationName}
                />
              </MapView>
            ) : null}

            <View style={styles.gridSection}>
                <View style={styles.gridItem}>
                    <Text style={styles.sectionTitle}>Recurring</Text>
                    <Text style={styles.rowValue}>{game.game.isRecurring ? 'Yes' : 'No'}</Text>
                </View>
                <View style={styles.gridItem}>
                    <Text style={styles.sectionTitle}>Gender Preference</Text>
                    <Text style={styles.rowValue}>{toTitleCase(game.game.genderPreference)}</Text>
                </View>
                <View>
                    <Text style={styles.sectionTitle}>Host</Text>
                    <Text style={styles.rowValue}>{game.creatorName}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Pressable style={game.userHasJoined ? styles.alreadyJoinedButton : styles.joingGameButton} onPress={() => onJoinOrLeave(game.game.id)}>
                    <Text style={styles.joinGameButtonText}>
                        {game.userHasJoined ? 'Leave Game' : 'Join Game'}
                    </Text>
                </Pressable>
            </View>
          </ScrollView>
        </View>

      </View>

    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    minHeight: 320,
    maxHeight: '84%',
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  backdropTapTarget: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#4b5563',
    marginTop: 4,
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  skillBadge: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 12,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#14b8a6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  skillBadgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.5,
    textTransform: 'capitalize',
  },
  section: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  gridSection: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
    paddingRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  scheduleText: {
    fontSize: 16,
    color: '#1f2937',
    marginTop: 6,
    marginBottom: 6,
  },
  infoRow: {
    marginTop: 6,
  },
  playerHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  playerSummaryText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  progressTrack: {
    width: '100%',
    height: 12,
    borderRadius: 999,
    backgroundColor: '#e5e7eb',
    marginTop: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#10b981',
  },
  rowLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  rowValue: {
    fontSize: 16,
    color: '#1f2937',
    marginTop: 2,
  },
  map: {
    marginTop: 12,
    width: '100%',
    height: 180,
    borderRadius: 12,
  },
  closeIconButton: {
    top: 45,
    left: 360,
    zIndex: 10,
    borderRadius: 999,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  joingGameButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3f419a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 15,
  },
  joinGameButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  alreadyJoinedButton: {
    backgroundColor: '#d70000',
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
});