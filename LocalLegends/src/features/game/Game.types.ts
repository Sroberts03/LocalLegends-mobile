import { GameFilter, GameWithDetails } from "@/src/models/Game";

export interface GetGamesReq {
    filter: GameFilter;
}

export interface GetGamesRes {
    games: GameWithDetails[];
}