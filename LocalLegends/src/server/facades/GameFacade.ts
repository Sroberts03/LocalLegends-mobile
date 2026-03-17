import { GameFilter, GameWithDetails } from "@/src/models/Game";

export default interface IGameFacade {
  listGames(filters: GameFilter): Promise<GameWithDetails[]>;
}