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
 * In this case it is a data object of the correct shape {@link GameRepository} that uses a class to keep hold of some state.
 *
 * This could equally well have been a closure over some store/config data
 *
 * If the repository requires any collaborators in future (metrics, logging) they can be passed to the constructor.
 */
export class MemoryGameRepository {
  private maxAttempts: number
  private store: Map<GameId, Game> = new Map();

  constructor(maxAttempts: number) {
    this.maxAttempts = maxAttempts
  }

  create(target: Array<Letter>): DomainResult<Game> {
    const game = {
      id: createGameId(),
      target: target,
      attempts: [],
      createdAt: new Date(),
      finished: false
    };

    this.store.set(game.id, game);

    return domainResult(game);
  }

  get(id: GameId): DomainResult<Game> {
    const game = this.store.get(id);
    if (game) {
      return domainResult(game);
    } else {
      return domainError(DomainError.NotFound);
    }
  }

  appendAttempt(id: GameId, attempt: Attempt): DomainResult<Game> {
    let current = this.get(id);

    console.log(`current: ${current}`);

    // NOTE: this is wild....we are building our own runtime type checks because our language has no idea
    if (isErr(current)) {
      return current;
    }

    const game: Game = unwrapResult(current);

    const newAttempts = game.attempts.concat([attempt])

    const newGame: Game = {
      id: game.id,
      target: game.target,
      attempts: newAttempts,
      createdAt: game.createdAt,
      finished: this.isFinished(newAttempts)
    };

    console.log(`new game: ${JSON.stringify(newGame)}`);

    this.store.set(newGame.id, newGame);

    return domainResult(newGame);
  }

  // TODO: debatable if this should be here or simply be a function we can provide for people to use against the
  //  Game data, however it does allow us to make a nice example of domain config.
  private isFinished(attempts: Array<Attempt>): boolean {
    if(attempts.length >= this.maxAttempts) {
      return true
    } else if(attempts.map( (attempt) => attempt.solved).includes(true)) {
      return true;
    }
    return false;
  }
}
