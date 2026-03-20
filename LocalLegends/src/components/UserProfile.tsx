import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import GameCard from "@/src/components/GameCard";
import { GameWithDetails } from "../models/Game";
import { ProfileInfo } from "../models/Profile";

type UserProfileProps = {
    profile: ProfileInfo | null;
    handleFollow?: () => void;
}

const sportIconMap = (sportName: string) => {
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

export default function UserProfile({ profile, handleFollow }: UserProfileProps) {
    // Helper for empty states
    const displayName = profile?.profile.displayName || "User";
    const favoriteSports = profile?.favoriteSports;
    const mostRecentGames = profile?.mostRecentGames;
      // Map favoriteSports to names if they are objects
      let favoriteSportsNames: string[] = [];
      if (favoriteSports) {
        favoriteSportsNames = favoriteSports.map((sport: { name: any; }) => {
          if (typeof sport === 'string') return sport;
          if (sport && typeof sport === 'object' && sport.name) return sport.name;
          return String(sport);
        });
      }

    return (
      <View style={styles.screenBg}>
        {/* Identity Section: Centered */}
        <Image 
          source={{ uri: profile?.profile.profileImageUrl || "https://i.pravatar.cc/300?u=default" }} 
          style={styles.profilePicture} 
        />
        <View style={styles.nameRow}>
            <Text style={styles.displayName}>{displayName}</Text>
            {handleFollow && (
            <Pressable onPress={handleFollow}>
                <Ionicons name="person-add" size={20} color="#4f46e5" />
            </Pressable>
            )}
        </View>
        {/* Favorite Sports */}
        <View>
        {favoriteSportsNames && favoriteSportsNames.length > 0 ? (
            <View style={styles.sportsPillContainer}>
            {favoriteSportsNames.map((sportName) => (
                <View key={sportName} style={styles.sportPill}>
                    <Ionicons name={sportIconMap(sportName)} size={35} color="#4f46e5" />
                </View>
            ))}
            </View>
        ) : (
            <Text style={styles.emptyState}>{`${displayName} hasn't added any favorite sports yet.`}</Text>
        )}
        {profile?.profile.bio && <Text style={styles.bio}>{profile.profile.bio}</Text>}
        </View>

        {/* Stats Grid: Row, below bio */}
        <View style={styles.statsGrid}>
          <View style={styles.statCell}>
            <Text style={styles.statValue}>{profile?.gamesJoined || 0}</Text>
            <Text style={styles.statLabel}>Joined</Text>
          </View>
          <View style={styles.leftStatDivider} />
          <View style={styles.statCell}>
            <Text style={styles.statValue}>{profile?.gamesCreated || 0}</Text>
            <Text style={styles.statLabel}>Created</Text>
          </View>
          <View style={styles.rightStatDivider} />
          <View style={styles.statCell}>
            <Text style={styles.statValue}>{profile?.profile.reliabilityScore != null ? `${profile.profile.reliabilityScore}%` : '--'}</Text>
            <Text style={styles.statLabel}>Reliability</Text>
          </View>
        </View>

        <View>
          <Text style={styles.sectionLabel}>Most Recent Games</Text>
          {mostRecentGames && mostRecentGames.length > 0 ? (
            <View style={styles.gamesList}>
              {mostRecentGames.map((game: GameWithDetails, idx: any) => (
                <GameCard key={game.game.id || idx} game={game} onPress={() => {}} />
              ))}
            </View>
          ) : (
            <Text style={styles.emptyState}>{`${displayName} hasn't played any recent games yet.`}</Text>
          )}
        </View>

        <Text style={styles.memberSince}>{`Member since ${profile ? profile.profile.yearJoined : 'Unknown'}`}</Text>
      </View>
    );
}

const styles = StyleSheet.create({
  screenBg: {
    width: '100%',
    paddingHorizontal: 16,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    alignSelf: 'center',
    borderWidth: 3,
    borderColor: '#6366f1',
  },
  displayName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 18,
    textAlign: 'center',
    alignSelf: 'center',
    maxWidth: 420,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
    marginBottom: 24,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statCell: {
    alignItems: 'center',
    minWidth: 70,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6366f1',
    marginBottom: 2,
  },
  rightStatDivider: {
    marginRight: -16,
    borderLeftWidth: 0.5,
    height: '100%',
  },
  leftStatDivider: {
    marginLeft: -16,
    borderColor: '#000000',
    borderWidth: 0.5,
    height: '100%',
  },
  statLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  sectionLabel: {
    marginTop: 12,
    fontSize: 15,
    color: '#6366f1',
    fontWeight: '600',
    justifyContent: 'center',
    marginBottom: 2,
    textAlign: 'left',
  },
  sectionValue: {
    fontSize: 15,
    color: '#374151',
    textAlign: 'left',
    fontWeight: '500',
  },
  emptyState: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
    marginTop: 2,
    textAlign: 'left',
  },
  sportsPillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', 
    gap: 10, 
    width: '100%',
    justifyContent: 'center',
    marginTop: 12, 
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
  },
  sportPill: {
    width: 60, 
    height: 60, 
    borderRadius: 30,
    backgroundColor: '#e0e7ff', 
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#c7d2fe', 
  },
  gamesList: {
    width: '100%', 
    gap: 12,
    marginTop: 8,
  },
  memberSince: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 24,
    textAlign: 'center',
    marginBottom: 50,
  },
});