import {Attempt, Game, GameId, Letter, LetterAttempt, parseLetter} from "./entity.js";
import {GameService} from "./gameService.js";
import {GameRepository} from "./gameRepository.js";
import {DomainError} from "./error.js";
import {isOk, unwrapResult,} from "./result.js";
import {domainError, DomainResult,} from "./domainResult.js";

/**
 * GameService implementation
 *
 * Implementation that relies solely on Domain level concepts to satisfy business logic.
 *
 * Here it relies on the {@link GameRepository}
 *
 * You can imagine it relying on WordList / Logging / Metrics - yes, even though Logging can be seen as a fairly low-level concern that is not tied to the Domain - but it can still be abstracted away from a particular implementation.
 *
 * @note any config to be passed to this should be contained within a type defined in the domain and not expose things such as the actual process env or file systems (they may not exist where we are running)
 */
export function createGameService(repository: GameRepository): GameService {
  return {
    createGame(): DomainResult<Game> {
      // TODO: generate from a word list or pass in a collaborator to retrieve words from
      const target = "stave";

      const targetLetters: Array<DomainResult<Letter>> = target
        .split("")
        .map((x: string) => {
          return parseLetter(x);
        });

      // NOTE: this is kind of ugly but there is scope to make it nicer - we don't have Validated/traverse or other tools here.
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

      if(game.finished) {
        return domainError(DomainError.GameFinished)
      }

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
