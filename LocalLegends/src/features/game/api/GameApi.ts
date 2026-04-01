import BaseRequest from "../../BaseRequest";
import { GetGamesReq, GetGamesRes } from "../Game.types";

export const GameApi = {
    async getGames(req: GetGamesReq): Promise<GetGamesRes> {
        return await BaseRequest("GET", req.filter, "games/list-games");
    }
}