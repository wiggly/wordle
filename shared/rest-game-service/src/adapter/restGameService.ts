import {createExpressEndpoints, initServer} from "@ts-rest/express";
import {Express} from "express";
import {initContract} from "@ts-rest/core";
import {z} from "zod";
import {GameService} from "@wordle/domain/gameService.js";
import {isErr, isOk, unwrapResult} from "@wordle/domain/result.js";
import {Attempt, Game, Letter, parseLetter} from "@wordle/domain/entity.js";
import {DomainError} from "@wordle/domain/error.js";

/**
 * LetterAttempt DTO Schema
 */
const LetterAttemptSchema = z.object({
    letter: z.string(),
    state: z.string(), // TODO: use the LetterState type
});

/**
 * Attempt DTO Schema
 */
const AttemptSchema = z.object({
    solved: z.boolean(),
    letters: LetterAttemptSchema.array(),
    createdAt: z.date(),
});

/**
 * Game DTO Schema
 */
const GameSchema = z.object({
    id: z.string(),
    attempts: AttemptSchema.array(),
    createdAt: z.date(),
});

/**
 * Error DTO Schema
 */
const ErrorSchema = z.object({
    code: z.string(),
    message: z.string()
});

/**
 * Attempt DTO
 */
export type AttemptDto = z.infer<typeof AttemptSchema>;

/**
 * Game DTO
 */
export type GameDto = z.infer<typeof GameSchema>;

/**
 * Error DTO
 */
export type ErrorDto = z.infer<typeof ErrorSchema>;

const c = initContract();

const contract = c.router({
    createGame: {
        method: "POST",
        path: "/game",
        responses: {
            201: GameSchema,
            500: c.type<void>(),
        },
        body: c.type<void>(),
        summary: "Create a new game",
    },
    getGame: {
        method: "GET",
        path: `/game/:id`,
        responses: {
            200: GameSchema,
            404: ErrorSchema,
            500: c.type<void>(),
        },
        summary: "Get a game by id",
    },
    createGuess: {
        method: "POST",
        path: `/game/:id/guess`,
        responses: {
            201: GameSchema,
            400: ErrorSchema,
            404: ErrorSchema,
            500: c.type<void>(),
        },
        body: z.object({
            letters: z.string().array(),
//            TODO: we can think about using Zod directly for this instead of the domain function
//             but it does give error codes that are easier for us to report on and work with
//            letters: LetterEnum.array()
        }),
        summary: "Create a new guess for this game",
    },
});

function attemptToDto(attempt: Attempt): AttemptDto {
    return {
        solved: attempt.solved,
        letters: attempt.letterAttempts.map((letter) => {
            return {
                letter: letter.letter,
                state: letter.state,
            };
        }),
        createdAt: attempt.createdAt,
    };
}

function gameToDto(game: Game): GameDto {
    return {
        id: game.id,
        attempts: game.attempts.map(attemptToDto),
        createdAt: game.createdAt,
    };
}

/**
 * TODO: Let's discuss this in the context of TS-Rest later, I must be missing something.
 */
type ErrorResponse =
    { status: 404; body: { code: string; message: string } } |
    { status: 400; body: { code: string; message: string } } |
    { status: 500, body: void }

function domainErrorToResponse(
    err: DomainError,
): ErrorResponse {
    // NOTE: we need to do this for some reason
    const code400: 400 = 400;
    const code404: 404 = 404;
    const code500: 500 = 500;

    if (err == DomainError.NotFound) {
        return {
            status: code404,
            body: {
                code: DomainError.NotFound,
                message: "Could not find that item."
            },
        };
    } else if (err == DomainError.InvalidLetter) {
        return {
            status: code400,
            body: {
                code: DomainError.InvalidLetter,
                message: "Some or all of the letters you provided are not in the acceptable range."
            },
        };
    } else if (err == DomainError.GameFinished) {
        return {
            status: code400,
            body: {
                code: DomainError.GameFinished,
                message: "This game is already finished and cannot be modified."
            },
        };
    } else {
        return {
            status: code500,
            body: undefined
        };
    }
}

/**
 * Incoming Adapter for GameService
 *
 * Function to create a set of HTTP routes that can be served to adapt inputs to call a {@link GameService}
 *
 * If the adapter requires any collaborators in future (metrics, logging) they can be passed to this function.
 */
export function createHttpGameService(gameService: GameService, app: Express): unknown {
    const server = initServer();

    const router = server.router(contract, {
        createGame: async () => {
            const result = gameService.createGame();

            if (isOk(result)) {
                return {
                    status: 200,
                    body: gameToDto(result.value),
                };
            } else {
                return domainErrorToResponse(result.err);
            }
        },

        getGame: async ({ params: { id } }) => {
            const result = gameService.getGame(id);
            if (isOk(result)) {
                return {
                    status: 200,
                    body: gameToDto(result.value),
                };
            } else {
                return domainErrorToResponse(result.err);
            }
        },

        createGuess: async ({ params: { id }, body: { letters } }) => {
            const input = letters.map(parseLetter);
            let guess: Array<Letter>;
            if (input.some(isErr)) {
                // TODO: this assumes the error but we should make it use one of the real errors....
                return domainErrorToResponse(DomainError.InvalidLetter);
            } else {
                guess = input.map(unwrapResult);
            }

            const result = gameService.getGame(id);

            if (isOk(result)) {
                const game = unwrapResult(result);
                const updated = gameService.processGuess(game, guess);

                console.log(`updated: ${updated}`);

                if (isOk(updated)) {
                    return {
                        status: 200,
                        body: gameToDto(updated.value),
                    };
                } else {
                    return domainErrorToResponse(updated.err);
                }
            } else {
                return domainErrorToResponse(result.err);
            }
        },
    });

    return createExpressEndpoints(contract, router, app);
}
