import { Letter, Attempt, Game, GameId, createGameId } from "@wordle/domain/entity.js";
import { GameRepository } from "@wordle/domain/gameRepository.js";
import { DomainError } from "@wordle/domain/error.js";
import {
  isErr,
  unwrapResult,
} from "@wordle/domain/result.js";

import {
  domainError,
  domainResult,
  DomainResult,
} from "@wordle/domain/domainResult.js";

/**
 * Outgoing Adapter for GameRepository
 *
 * Function to create/find/construct an implementation
 *
 * In this case it is a data object of the correct shape {@link GameRepository} that uses a closure to keep hold of some state.
 *
 * This could equally well have been a javascript Class
 *
 * If the repository requires any collaborators in future (metrics, logging) they can be passed to this function.
 */
export function createMemoryGameRepository(): GameRepository {
  let store: Map<GameId, Game> = new Map();

  return {
    create(target: Array<Letter>): DomainResult<Game> {
      const game = {
        id: createGameId(),
        target: target,
        attempts: [],
        createdAt: new Date(),
        finished: false
      };

      store.set(game.id, game);

      return domainResult(game);
    },

    get(id: GameId): DomainResult<Game> {
      const game = store.get(id);
      if (game) {
        return domainResult(game);
      } else {
        return domainError(DomainError.NotFound);
      }
    },

    appendAttempt(id: GameId, attempt: Attempt): DomainResult<Game> {
      let current = this.get(id);

      console.log(`current: ${current}`);

      // NOTE: this is wild....we are building our own runtime type checks because our language has no idea
      if (isErr(current)) {
        return current;
      }

      const game: Game = unwrapResult(current);

      console.log(`game: ${game}`);

      const newGame: Game = {
        id: game.id,
        target: game.target,
        attempts: game.attempts.concat([attempt]),
        createdAt: game.createdAt,
        finished: attempt.solved
      };

      console.log(`new game: ${JSON.stringify(newGame)}`);

      store.set(newGame.id, newGame);

      return domainResult(newGame);
    },
  };
}
