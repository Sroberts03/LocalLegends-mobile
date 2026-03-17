import { GameFilter, GameWithDetails } from "@/src/models/Game";
import IGameFacade from "../facades/GameFacade";
import MockDataStore from "./MockDataStore";

export default class MockGameFacade implements IGameFacade {
    calculateDistance(gameLocation: { latitude: number; longitude: number }, userLocation: { latitude: number; longitude: number }): number {
        const toRad = (value: number) => (value * Math.PI) / 180;
        const R = 6371;
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

        if (filter.sportId) {
            games = games.filter(g => g.sportId === filter.sportId);
        }
        if (filter.skillLevel) {
            games = games.filter(g => g.skillLevel === filter.skillLevel);
        }
        if (filter.genderPreference) {
            games = games.filter(g => g.genderPreference === filter.genderPreference);
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
}