import { SearchedGame } from "@/src/models/Game";
import Profile from "@/src/models/Profile";

export default interface ISearchFacade {
    searchAll: (
        query: string, 
        filters: { games: boolean, players: boolean }, 
        lat: number, 
        lng: number,
        limit: number,
        offset: number
    ) => Promise<{ games: SearchedGame[], players: Profile[] }>;
    searchLocations: (
        query: string, 
        lat: number, 
        lng: number,
        limit: number,
    ) => Promise<SearchedGame[]>;
    getTrendingGames: (
        lat: number, 
        lng: number,
        limit: number,
    ) => Promise<SearchedGame[]>;
    getSuggestedPlayers: (
        lat: number, 
        lng: number,
        limit: number,
    ) => Promise<Profile[]>;
}