import { GameFilter, GameWithDetails } from "@/src/models/Game";

export interface ListGamesRequest {
    filters: GameFilter;
}

export interface ListGamesResponse {
    games: GameWithDetails[];
}