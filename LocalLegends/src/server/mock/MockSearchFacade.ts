import Game, { SearchedGame } from "@/src/models/Game";
import Profile from "@/src/models/Profile";
import MockDataStore from "./MockDataStore";
import ISearchFacade from "../facades/SearchFacade";


export default class MockSearchFacade implements ISearchFacade {

    private mapToSearchedGame(game: Game): SearchedGame {
        return {
            id: game.id,
            name: game.name,
            sportName: MockDataStore.Sports.get(game.sportId)?.name || "Unknown Sport",
            locationName: MockDataStore.Locations.get(game.locationId)?.name || "Unknown Location",
            creatorName: MockDataStore.Users.get(game.creatorId)?.displayName || "Unknown Creator",
            startTime: game.startTime,
            endTime: game.endTime,
            skillLevel: game.skillLevel,
            genderPreference: game.genderPreference,
            currentPlayerCount: game.currentPlayerCount,
            maxPlayers: game.maxPlayers,
            currentUserHasJoined: MockDataStore.userGames.get(MockDataStore.currentUserId)?.includes(game.id) || false, 
        };
    }

    private async simulateNetworkDelay(ms: number = 300) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async searchAll(
        query: string, 
        filters: { games: boolean, players: boolean }, 
        lat: number, 
        lng: number,
        limit: number = 10,
        offset: number = 0
    ): Promise<{ games: SearchedGame[], players: Profile[] }> {
        console.log(`MockSearchFacade.searchAll called with query="${query}", filters=${JSON.stringify(filters)}, lat=${lat}, lng=${lng}, limit=${limit}, offset=${offset}`);
        
        await this.simulateNetworkDelay();
        
        const lowerQuery = query.toLowerCase();
        let resultGames: SearchedGame[] = [];
        let resultPlayers: Profile[] = [];

        // 1. Process Games if requested
        if (filters.games) {
            const allGames = Array.from(MockDataStore.Games.values());
            resultGames = allGames
                .filter(game => game.name.toLowerCase().includes(lowerQuery))
                .map(game => this.mapToSearchedGame(game))
                .slice(offset, offset + limit);
        }

        // 2. Process Players if requested
        if (filters.players) {
            const allPlayers = Array.from(MockDataStore.Users.values());
            resultPlayers = allPlayers
                .filter(player => player.displayName.toLowerCase().includes(lowerQuery))
                .slice(offset, offset + limit);
        }

        return { games: resultGames, players: resultPlayers };
    }

    async searchLocations(
        query: string, 
        lat: number, 
        lng: number,
        limit: number = 10,
    ): Promise<SearchedGame[]> {
        await this.simulateNetworkDelay();
        
        const lowerQuery = query.toLowerCase();
        const allLocations = Array.from(MockDataStore.Locations.values());
        
        // Find matching locations
        const filteredLocationIds = allLocations
            .filter(location => location.name.toLowerCase().includes(lowerQuery))
            .map(loc => loc.id);

        // Find games at those locations and map them
        const gamesAtLocations = Array.from(MockDataStore.Games.values())
            .filter(game => filteredLocationIds.includes(game.locationId))
            .map(game => this.mapToSearchedGame(game));

        return gamesAtLocations.slice(0, limit);
    }

    async getTrendingGames(
        lat: number, 
        lng: number,
        limit: number = 3,
    ): Promise<SearchedGame[]> {
        await this.simulateNetworkDelay();

        return Array.from(MockDataStore.Games.values())
            .sort((a, b) => b.currentPlayerCount - a.currentPlayerCount)
            .slice(0, limit)
            .map(game => this.mapToSearchedGame(game));
    }

    async getSuggestedPlayers(
        lat: number, 
        lng: number,
        limit: number = 3,
    ): Promise<Profile[]> {
        await this.simulateNetworkDelay();

        // For simplicity, just return the first 'limit' players
        return Array.from(MockDataStore.Users.values()).slice(0, limit);
    }
}