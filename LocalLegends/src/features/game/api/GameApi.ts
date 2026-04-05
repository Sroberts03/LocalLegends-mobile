import BaseRequest from "../../BaseRequest";
import { CreateGameReq, CreateGameRes, GetGamesReq, GetGamesRes, GetSportsRes, JoinGameReq, JoinGameRes } from "../Game.types";

export const GameApi = {
    async getGames(req: GetGamesReq): Promise<GetGamesRes> {
        return await BaseRequest("GET", req.filter, "games/list-games");
    },

    async createGame(gameData: CreateGameReq): Promise<CreateGameRes> {
        return await BaseRequest("POST", gameData, "games/create-game");
    },

    async getSports(): Promise<GetSportsRes> {
        return await BaseRequest("GET", {}, "games/list-sports");
    },

    async getMyGames(): Promise<GetGamesRes> {
        return await BaseRequest("GET", {}, "games/my-games");
    },

    async joinGame(req: JoinGameReq): Promise<JoinGameRes> {
        return await BaseRequest("POST", req, "games/join-game");
    },

    async leaveGame(req: JoinGameReq): Promise<JoinGameRes> {
        return await BaseRequest("DELETE", req, "games/leave-game");
    }
}