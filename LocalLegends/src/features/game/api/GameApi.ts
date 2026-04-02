import Sport from "@/src/models/Sport";
import BaseRequest from "../../BaseRequest";
import { GetGamesReq, GetGamesRes, GetSportsRes } from "../Game.types";
import Game, { GameCreation } from "@/src/models/Game";

export const GameApi = {
    async getGames(req: GetGamesReq): Promise<GetGamesRes> {
        const res = await BaseRequest("GET", req.filter, "games/list-games");
        console.log("getGames res", JSON.stringify(res, null, 2));
        return res;
    },

    async createGame(gameData: GameCreation): Promise<Game> {
        return await BaseRequest("POST", gameData, "games/create-game");
    },

    async getSports(): Promise<GetSportsRes> {
        return await BaseRequest("GET", {}, "games/list-sports");
    }
}