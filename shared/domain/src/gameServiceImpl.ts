import { Attempt, Game, GameId, LetterAttempt } from "./game.js";
import { Letter, parseLetter } from "./letter.js";
import { GameService } from "./gameService.js";
import { GameRepository } from "./gameRepository.js";
import { DomainError } from "./error.js";
import {
  isOk,
  unwrapResult,
} from "./result.js";
import {
  domainError,
  DomainResult,
} from "./domainResult.js";

export function createGameService(repository: GameRepository): GameService {
  return {
    createGame(): DomainResult<Game> {
      // TODO: generate from a word list
      const target = "stave";

      const targetLetters: Array<DomainResult<Letter>> = target
        .split("")
        .map((x: string) => {
          return parseLetter(x);
        });

      if (targetLetters.every((result) => isOk(result))) {
        return repository.create(targetLetters.map((x) => unwrapResult(x)));
      } else {
        return domainError(DomainError.InvalidLetter);
      }
    },

    getGame(id: GameId): DomainResult<Game> {
      return repository.get(id);
    },

    processGuess(game: Game, guess: Array<Letter>): DomainResult<Game> {
      console.log("process Guess");
      let result: Array<LetterAttempt> = guess.map((letter, i) => {
        if (game.target[i] == letter) {
          return { letter: letter, state: "Correct" };
        } else if (game.target.includes(letter)) {
          return { letter: letter, state: "Present" };
        } else {
          return { letter: letter, state: "Incorrect" };
        }
      });

      const attempt: Attempt = {
        solved: result.map((x) => x.state).every((x) => x === "Correct"),
        letterAttempts: result,
        createdAt: new Date(),
      };

      return repository.appendAttempt(game.id, attempt);
    },
  };
}
