import { GameCreation, GameFilter, GameWithDetails } from "@/src/models/Game";
import Sport from "@/src/models/Sport";

export default interface IGameFacade {
  listGames(filters: GameFilter): Promise<GameWithDetails[]>;
  getSports(): Promise<Sport[]>;
  createGame(gameData: GameCreation): Promise<void>;
}