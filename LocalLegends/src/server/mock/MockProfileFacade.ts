import MockDataStore from "./MockDataStore";
import IProfileFacade from "../facades/ProfileFacade";
import { ProfileInfo } from "@/src/models/Profile";
import Game, { GameWithDetails } from "@/src/models/Game";
import Sport from "@/src/models/Sport";

export default class MockProfileFacade implements IProfileFacade {
    async me(): Promise<ProfileInfo> {
        const currentUserId = MockDataStore.currentUserId;
        const userFavoriteSportsIds = MockDataStore.userSports.get(currentUserId) || [];
        
        if (!currentUserId) {
            throw new Error("No user is currently logged in");
        }
        const user = MockDataStore.Users.get(currentUserId);
        if (!user) {
            throw new Error("User not found");
        }

        // FIX 1: Add .values() to correctly extract the game objects from the Map
        const gamesCreated = Array.from(MockDataStore.Games.values())
            .filter(game => game.creatorId === currentUserId).length;

        // FIX 2: Properly hydrate the GameWithDetails objects
        // First, get the raw games the user is involved in (either created or joined)
        const rawGames = Array.from(MockDataStore.userGames.get(currentUserId) || [])
            .map(gameId => MockDataStore.Games.get(gameId))
            .filter((game): game is Game => !!game && game.status !== 'draft');

        // Second, wrap them in the GameWithDetails structure for your GameCards
        const mostRecentGames: GameWithDetails[] = rawGames.map(game => {
            const location = MockDataStore.Locations.get(game.locationId);
            const sport = MockDataStore.Sports.get(game.sportId);
            
            return {
                game: game,
                locationName: location?.name || "Unknown Location",
                sportName: sport?.name || "Unknown Sport",
                latitude: location?.latitude || 0,
                longitude: location?.longitude || 0,
                creatorName: MockDataStore.Users.get(game.creatorId)?.displayName || "Unknown Creator",
                userHasJoined: true,
                memberProfiles: []
            };
        })
        // Notice we use b.game.createdAt instead of b.createdAt now that it's wrapped
        .sort((a, b) => b.game.createdAt.getTime() - a.game.createdAt.getTime())
        .slice(0, 5);

        const gamesJoined = Array.from(MockDataStore.userGames.get(currentUserId) || []).length;
        
        const favoriteSports = userFavoriteSportsIds
            .map((id) => MockDataStore.Sports.get(id))
            .filter((v): v is Sport => !!v);

        return {
            profile: user,
            gamesCreated: gamesCreated,
            gamesJoined: gamesJoined,
            favoriteSports: favoriteSports,
            mostRecentGames: mostRecentGames
        };
    }

    async getUserProfile(userId: string): Promise<ProfileInfo> {
        const user = MockDataStore.Users.get(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const userFavoriteSportsIds = MockDataStore.userSports.get(userId) || [];
        const favoriteSports = userFavoriteSportsIds
            .map((id) => MockDataStore.Sports.get(id))
            .filter((v): v is Sport => !!v);

        return {
            profile: user,
            gamesCreated: 0, // For simplicity, we won't calculate this for other users in the mock
            gamesJoined: 0,   // Same as above
            favoriteSports: favoriteSports,
            mostRecentGames: [], // Same as above
            currentUserIsFollowing: false
        };
    }
}