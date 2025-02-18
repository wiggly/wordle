import { Letter } from "../letter.js";
import { Attempt, Game, GameId } from "../game.js";
import { GameRepository } from "../gameRepository.js";
import { v4 as uuidv4 } from "uuid";
import { DomainError } from "../error.js";
import {
  isErr,
  unwrapResult,
} from "../result.js";

import {
  domainError,
  domainResult,
  DomainResult,
} from "../domainResult.js";

export function createMemoryGameRepository(): GameRepository {
  let store: Map<GameId, Game> = new Map();

  return {
    create(target: Array<Letter>): DomainResult<Game> {
      const game = {
        id: uuidv4(),
        // ugly....how do we do this nicely?
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

    update(game: Game): DomainResult<Game> {
      let current = this.get(game.id);

      // NOTE: this is wild....we are building our own runtime type checks because our language has no idea
      if (isErr(current)) {
        return current;
      }

      store.set(game.id, game);

      return domainResult(game);
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
