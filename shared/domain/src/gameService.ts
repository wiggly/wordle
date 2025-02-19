import { Letter, Game, GameId } from "./entity.js";
import { DomainResult } from "./domainResult.js";

/**
 * GameService
 *
 * Terminology: Domain Service (DDD) / Use-Case / Incoming Port / Driving
 *
 * One person's Incoming is another person's Use-Case
 *
 * In a larger system there may be a lot of different Use-Cases that rely on one or more Domain Service to get their job done.
 *
 * Wordle is very simple however and the domain service itself also serves as a use-Case here.
 *
 */
export interface GameService {
  createGame(): DomainResult<Game>;

  getGame(id: GameId): DomainResult<Game>;

  processGuess(game: Game, guess: Array<Letter>): DomainResult<Game>;
}
