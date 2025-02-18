import { Attempt, Game, GameId } from "./game.js";
import { Letter } from "./letter.js";
import { DomainResult } from "./domainResult.js";

export interface GameRepository {
  create(target: Array<Letter>): DomainResult<Game>;
  get(id: GameId): DomainResult<Game>;
  update(game: Game): DomainResult<Game>;
  appendAttempt(id: GameId, attempt: Attempt): DomainResult<Game>;
}
