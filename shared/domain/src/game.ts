import { Letter, LetterState } from "./letter.js";

export type LetterAttempt = {
  letter: Letter;
  state: LetterState;
};

export type Attempt = {
  // TODO: add an ID here so we can make new attempts idempotent using DB constraints
  readonly solved: boolean;
  readonly letterAttempts: Array<LetterAttempt>;
  readonly createdAt: Date;
};

export type GameId = string;

export type Game = {
  readonly id: GameId;
  readonly target: Array<Letter>;
  readonly attempts: Array<Attempt>;
  readonly createdAt: Date;
};
