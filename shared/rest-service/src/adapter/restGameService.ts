import { createExpressEndpoints, initServer } from "@ts-rest/express";
import { Express } from "express";
import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { GameService } from "@wordle/domain/gameService.js";
import { isErr, isOk, unwrapResult } from "@wordle/domain/result.js";
import { Attempt, Game } from "@wordle/domain/game.js";
import { DomainError } from "@wordle/domain/error.js";
import { Letter, parseLetter } from "@wordle/domain/letter.js";

const LetterAttemptSchema = z.object({
    letter: z.string(),
    state: z.string(),
});

const AttemptSchema = z.object({
    solved: z.boolean(),
    letters: LetterAttemptSchema.array(),
    createdAt: z.date(),
});

const GameSchema = z.object({
    id: z.string(),
    attempts: AttemptSchema.array(),
    createdAt: z.date(),
});

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
            404: c.type<void>(),
            500: c.type<void>(),
        },
        summary: "Get a game by id",
    },
    createGuess: {
        method: "POST",
        path: `/game/:id/guess`,
        responses: {
            201: GameSchema,
            404: c.type<void>(),
            500: c.type<void>(),
        },
        body: z.object({
            letters: z.string().array(),
        }),
        summary: "Create a new guess for this game",
    },
});

export type AttemptDto = z.infer<typeof AttemptSchema>;

export type GameDto = z.infer<typeof GameSchema>;

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

function domainErrorToResponse(
    err: DomainError,
) /*: { status: DomainHttpStatusCodes, body?: unknown } */ {
    // NOTE: we need to do this for some reason
    const code400: 400 = 400;
    const code404: 404 = 404;
    const code500: 500 = 500;

    if (err == DomainError.NotFound) {
        return {
            status: code404,
            body: undefined,
        };
    } else if (err == DomainError.InvalidLetter) {
        return {
            status: code400,
            body: undefined,
        };
    } else {
        return {
            status: code500,
            body: undefined,
        };
    }
}

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
                // TODO: make it use one of the real errors....
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
