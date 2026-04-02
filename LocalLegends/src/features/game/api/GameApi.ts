import Sport from "@/src/models/Sport";
import BaseRequest from "../../BaseRequest";
import { GetGamesReq, GetGamesRes, GetSportsRes } from "../Game.types";
import Game, { GameCreation } from "@/src/models/Game";

export const GameApi = {
    async getGames(req: GetGamesReq): Promise<GetGamesRes> {
        return await BaseRequest("GET", req.filter, "games/list-games");
    },

    async createGame(gameData: GameCreation): Promise<Game> {
        return await BaseRequest("POST", gameData, "games/create-game");
    },

    async getSports(): Promise<GetSportsRes> {
        return await BaseRequest("GET", {}, "games/list-sports");
    },

    async getMyGames(): Promise<GetGamesRes> {
        return await BaseRequest("GET", {}, "games/my-games");
    }
}