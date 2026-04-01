import { GameFilter, GameWithDetails } from "@/src/models/Game";
import Sport from "@/src/models/Sport";

export interface GetGamesReq {
    filter: GameFilter;
}

export interface GetGamesRes {
    games: GameWithDetails[];
}

export interface GetSportsRes {
    sports: Sport[];
}