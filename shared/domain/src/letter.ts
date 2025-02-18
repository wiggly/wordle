import { z } from "zod";
import { domainError, domainResult, DomainResult } from "./domainResult.js";
import { DomainError } from "./error.js";

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

export type Letter = z.infer<typeof LetterEnum>;

export function parseLetter(input: string): DomainResult<Letter> {
  const result = LetterEnum.safeParse(input);
  if (result.success) {
    return domainResult(result.data);
  } else {
    return domainError(DomainError.InvalidLetter);
  }
}

// TODO: use TS enum here?
export const LetterStateEnum = z.enum(["Correct", "Present", "Incorrect"]);

export type LetterState = z.infer<typeof LetterStateEnum>;
