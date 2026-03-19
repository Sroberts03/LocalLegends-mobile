import Game, { GameCreation, GameFilter, GameWithDetails, SkillLevel, GenderPreference } from "@/src/models/Game";
import IGameFacade from "../facades/GameFacade";
import MockDataStore from "./MockDataStore";

export default class MockGameFacade implements IGameFacade {
    calculateDistance(gameLocation: { latitude: number; longitude: number }, userLocation: { latitude: number; longitude: number }): number {
        const toRad = (value: number) => (value * Math.PI) / 180;
        const R = 3958.8;
        const dLat = toRad(gameLocation.latitude - userLocation.latitude);
        const dLon = toRad(gameLocation.longitude - userLocation.longitude);
        const lat1 = toRad(userLocation.latitude);
        const lat2 = toRad(gameLocation.latitude);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    async listGames(filter: GameFilter): Promise<GameWithDetails[]> {
        let games = Array.from(MockDataStore.Games.values());
        const locations = MockDataStore.Locations;
        const sports = MockDataStore.Sports;
        const users = MockDataStore.Users;
        const currentUserId = MockDataStore.currentUserId;
        const userGameIds = MockDataStore.userGames.get(currentUserId) || [];

        if (filter.sportIds && filter.sportIds.length > 0) {
            games = games.filter(g => filter.sportIds!.includes(g.sportId));
        }
        if (filter.skillLevels && filter.skillLevels.length > 0) {
            games = games.filter(g => filter.skillLevels!.includes(g.skillLevel));
        }
        if (filter.genderPreferences && filter.genderPreferences.length > 0) {
            games = games.filter(g => filter.genderPreferences!.includes(g.genderPreference));
        }
        if (filter.happeningTodayOnly) {
            const today = new Date();
            games = games.filter(g => g.startTime.toDateString() === today.toDateString());
        }
        if (filter.favoritesOnly) {
            const favoriteSportIds = [1, 3];
            games = games.filter(g => favoriteSportIds.includes(g.sportId));
        }
        games = games.filter(g => this.calculateDistance({ latitude: locations.get(g.locationId)!.latitude, longitude: locations.get(g.locationId)!.longitude }, { latitude: filter.latitude, longitude: filter.longitude }) <= filter.maxDistance);
        games = games.filter(g => g.status === "active" || g.status === "coordination");
        games = games.filter(g => g.startTime > new Date());
        games = games.filter(g => g.currentPlayerCount < g.maxPlayers);
        games = games.filter(g => g.creatorId !== currentUserId);
        games = games.filter(g => !userGameIds.includes(g.id));
        return Promise.resolve(games.map(g => {
            const location = locations.get(g.locationId)!;
            return {
                game: g,
                locationName: location.name,
                sportName: sports.get(g.sportId)!.name,
                creatorName: users.get(g.creatorId)!.displayName,
                latitude: location.latitude,
                longitude: location.longitude
            };
        }));
    }

    async getSports() {
        return Promise.resolve(Array.from(MockDataStore.Sports.values()));
    }

    async createGame(gameData: GameCreation): Promise<void> {
        let locationId = 0;
        const currentUserId = MockDataStore.currentUserId;
        if (gameData.googlePlaceId) {
            const locations = Array.from(MockDataStore.Locations.values());
            for (const loc of locations) {
                if (loc.googlePlaceId === gameData.googlePlaceId) {
                    gameData.googlePlaceId = undefined;
                    locationId = loc.id;
                    break;
                }
            }
            if (locationId === 0) {
                locationId = MockDataStore.Locations.size + 1;
                MockDataStore.Locations.set(locationId, {
                    id: locationId,
                    name: gameData.locationName || "Unnamed Location",
                    description: gameData.gameDescription || "",
                    streetAddress: gameData.streetAddress || "",
                    city: gameData.city || "",
                    state: gameData.state || "",
                    zipCode: gameData.zipCode || "",
                    country: gameData.country || "",
                    latitude: gameData.latitude!,
                    longitude: gameData.longitude!,
                    googlePlaceId: gameData.googlePlaceId!
                });
            }
        }

        const newGameId = MockDataStore.Games.size + 1;
       
        const newGame: Game = {
            id: newGameId,
            creatorId: MockDataStore.currentUserId,
            sportId: gameData.sportId!,
            locationId: locationId!,
            name: gameData.gameName || "Untitled Game",
            description: gameData.gameDescription || "",
            maxPlayers: gameData.maxPlayers || 10,
            minPlayers: gameData.minPlayers || 2,
            startTime: gameData.startTime || new Date(),
            endTime: gameData.endTime || new Date(),
            status: gameData.status || "draft",
            isRecurring: gameData.isRecurring || false,
            skillLevel: gameData.skillLevel || SkillLevel.All,
            genderPreference: gameData.genderPreference || GenderPreference.NoPreference,
            currentPlayerCount: 1
        };
        MockDataStore.Games.set(newGameId, newGame);
        MockDataStore.userGames.set(currentUserId, [...(MockDataStore.userGames.get(currentUserId) || []), newGameId]);
    }
}