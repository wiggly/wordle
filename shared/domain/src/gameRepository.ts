import { Letter, Attempt, Game, GameId } from "./entity.js";
import { DomainResult } from "./domainResult.js";

/**
 * GameRepository
 *
 * A Domain-level Repository for Entities.
 *
 * Terminology: Outgoing Port / Driven
 */
export interface GameRepository {
  create(target: Array<Letter>): DomainResult<Game>;

  // TODO: change to return Game | null - get rid of Not Found
  get(id: GameId): DomainResult<Game>;

  appendAttempt(id: GameId, attempt: Attempt): DomainResult<Game>;
}
