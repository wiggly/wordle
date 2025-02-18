import { Game, GameId } from "./game.js";
import { Letter } from "./letter.js";
import { DomainResult } from "./domainResult.js";

export interface GameService {
  createGame(): DomainResult<Game>;

  getGame(id: GameId): DomainResult<Game>;

  processGuess(game: Game, guess: Array<Letter>): DomainResult<Game>;
}
