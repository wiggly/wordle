import {describe, expect, it, assert} from "vitest";
import {MemoryGameRepository} from "../../src/adapter/memoryGameRepository.ts";
import {createGameId, Game, Letter} from "@wordle/domain/entity.js";
import {isErr, isOk} from "@wordle/domain/result.js";
import {DomainError} from "@wordle/domain/error.js";
import {unwrapDomainResult} from "@wordle/domain/domainResult.js";

const maxAttempts = 2

const subject = new MemoryGameRepository(maxAttempts)

/**
 * @todo how could/would we pull these tests out and run them against *ALL* repos for common functionality?
 */
describe('MemoryGameRepository', () => {

    it('can create a new game given a valid target', () => {
        const target: Array<Letter> = [ "u", "n", "d", "e", "r" ]
        const result = subject.create(target)
        expect(isOk(result)).toBeTruthy
        const game = unwrapDomainResult<Game>(result)
        expect(game.target).toEqual(target)
    })

    it('cannot create a new game given an invalid target length', () => {
        const target: Array<Letter> = [ "b", "l", "u", "n", "d", "e", "r" ]
        const result = subject.create(target)
        expect(isErr(result)).toBeTruthy
        if(isErr(result)) {
            expect(result.err).toBe(DomainError.InvalidLength)
        } else {
            assert.fail("Should not be able to create games with this number of target letters")
        }
    })

    it('can retrieve a previously created game', () => {
        const target: Array<Letter> = [ "u", "n", "d", "e", "r" ]
        const game = unwrapDomainResult(subject.create(target))

        const retrieved = subject.get(game.id)

        if(isOk(retrieved)) {
            expect(retrieved.value.id).toEqual(game.id)
        } else {
            assert.fail("Cannot retrieve game I just created")
        }
    })

    it('cannot retrieve a random GameId', () => {
        const result = subject.get(createGameId())

        if(isErr(result)) {
            expect(result.err).toEqual(DomainError.NotFound)
        } else {
            assert.fail("Managed to retrieve game that was never created")
        }
    })

    it('returns a unfinished game given fewer than max attempts', () => {
        const target: Array<Letter> = [ "u", "n", "d", "e", "r" ]
        const game: Game = unwrapDomainResult(subject.create(target))

        const attempt: Array<Letter> = [ "x", "x", "x", "x", "x" ]
        const result = subject.appendAttempt(game.id, attempt)

        if(isOk(result)) {
            expect(result.value.finished).toBeFalsy
        } else {
            assert.fail("Cannot append attempt to test game")
        }
    })

    it('returns a finished game given the correct word', () => {
        const target: Array<Letter> = [ "u", "n", "d", "e", "r" ]
        const game: Game = unwrapDomainResult(subject.create(target))

        const result = unwrapDomainResult<Game>(subject.appendAttempt(game.id, target))

        expect(result.finished).toBeTruthy
    })

    it('returns a finished game given the maximum number of attempts', () => {
        const target: Array<Letter> = [ "u", "n", "d", "e", "r" ]
        const game: Game = unwrapDomainResult(subject.create(target))

        const attempt: Array<Letter> = [ "x", "x", "x", "x", "x" ]

        unwrapDomainResult(subject.appendAttempt(game.id, attempt))
        const result = unwrapDomainResult<Game>(subject.appendAttempt(game.id, attempt))

        expect(result.finished).toBeTruthy
    })

})
