/**
 * The different things that can go wrong in our Domain
 *
 * You can argue whether something not being found is an error or not. maybe the repo should be refactored to return {Game | null} instead of {DomainResult<Game>}
 *
 */
export enum DomainError {
  // We could not find something that we expected to find.
  // Potentially debatable as a domain error but it does make error handling more uniform.
  // Should probably change repository/service to return an `Entity | null`
  NotFound = "NOT_FOUND",

  // You attempted to convert something to a letter, it was found to be invalid
  InvalidLetter = "INVALID_LETTER",

  // You attempted to create a `word` from the wrong number of `Letters`
  InvalidLength = "INVALID_LENGTH",

  // You are attempting to play more moves on a game that has already finished
  GameFinished = "GAME_FINISHED",
}

/**
 * Error compatible domain exception that holds our error reason/code/detail
 */
export class DomainException extends Error {
  readonly error: DomainError

  constructor(error: DomainError, message?: string) {
    super(message || `Domain error - ${error.toString()}`)
    this.error = error;
  }
}
