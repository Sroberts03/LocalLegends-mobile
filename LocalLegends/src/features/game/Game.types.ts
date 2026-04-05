import Game, { GameCreation, GameFilter, GameWithDetails } from "@/src/models/Game";
import Sport from "@/src/models/Sport";

export interface GetGamesReq {
    filter: GameFilter;
}

export interface CreateGameReq extends GameCreation { }

export interface CreateGameRes {
    game: GameWithDetails;
}
    
export interface GetGamesRes {
    games: GameWithDetails[];
}

export interface GetSportsRes {
    sports: Sport[];
}

export interface JoinGameReq {
    gameId: string;
}

export interface JoinGameRes {
    success: boolean;
    message: string;
}
    