import {z} from "zod";
import {domainError, domainResult, DomainResult} from "./domainResult.js";
import {DomainError} from "./error.js";
import { v4 as uuidv4 } from "uuid";

export const LetterEnum = z.enum([
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
]);

/**
 * Letter
 *
 * A valid letter in the domain of our game.
 *
 * Terminology: Value Object (DDD)
 */
export type Letter = z.infer<typeof LetterEnum>;

export function parseLetter(input: string): DomainResult<Letter> {
  const result = LetterEnum.safeParse(input);
  if (result.success) {
    return domainResult(result.data);
  } else {
    return domainError(DomainError.InvalidLetter);
  }
}

// TODO: function to parse a string as multiple letters and return a {DomainResult<Array<Letter>>?}

// TODO: use TS enum here?
export const LetterStateEnum = z.enum(["Correct", "Present", "Incorrect"]);

/**
 * LetterState
 *
 * The state of a letter within an attempt at solving our game
 *
 * Terminology: Value Object (DDD)
 */
export type LetterState = z.infer<typeof LetterStateEnum>;

/**
 * Game
 *
 * The result for a single letter within an {@link Attempt} to solve a game.
 *
 * Terminology: Value Object (DDD)
 */
export type LetterAttempt = {
  letter: Letter;
  state: LetterState;
};

/**
 * Attempt
 *
 * A single attempt to solve a game.
 *
 * Terminology: Value Object (DDD)
 *
 * @todo force attempt to be constrained by length in the type system
 */
export type Attempt = {
  // TODO: add an ID here so we can make new attempts idempotent using DB constraints
  readonly solved: boolean;
  // TODO: constrain this to be the correct length for our game
  readonly letterAttempts: Array<LetterAttempt>;
  readonly createdAt: Date;
};

/**
 * GameId
 *
 * Alias to easily change the type of ID we use for a Game
 *
 * @todo we could make this safer by creating a type that cannot be assigned from string...
 */
export type GameId = string;

/**
 * Give client's an easy way of generating our IDs without knowing how
 */
export function createGameId(): GameId {
  return uuidv4()
}

/**
 * Game
 *
 * Terminology: Entity (DDD)
 *
 * @todo force target to be constrained by length in the type system
 */
export type Game = {
  readonly id: GameId;
  readonly target: Array<Letter>;
  readonly attempts: Array<Attempt>;
  readonly createdAt: Date;
  readonly finished: boolean;
};
