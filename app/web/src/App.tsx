import React, {FormEvent, useState} from 'react';
import { createGameService } from "@wordle/domain/gameServiceImpl.js";
import { MemoryGameRepository } from "@wordle/memory-game-repository/adapter/memoryGameRepository.js";
import {Letter, parseLetter, Game} from "@wordle/domain/entity.js";
import { Attempt as AttemptElement } from "./Attempt.js";
import {unwrapDomainResult} from "@wordle/domain/domainResult.js";

import './style.css'
import {Configuration} from "@wordle/domain/configuration.js";

const configuration: Configuration = {
    maxAttempts: 5
}

const gameService = createGameService(new MemoryGameRepository(configuration.maxAttempts));

export default function App() {

    const newGame: () => Game = () => {
        return unwrapDomainResult(gameService.createGame())
    }

    const [currentGame, setCurrentGame] = useState<Game>(newGame);

    console.log(`current game id ${currentGame.id}`)

    function handleSubmit(event: React.FormEvent): void {
        event.preventDefault()
        const form: HTMLFormElement = event.target as HTMLFormElement;
        const formData = new FormData(form);

        console.log(JSON.stringify(formData))

        const input = [
            formData.get("letter1"),
            formData.get("letter2"),
            formData.get("letter3"),
            formData.get("letter4"),
            formData.get("letter5")
        ].filter( (x) => typeof x === "string")

        try {
            const letters: Array<Letter> = input
                .map(parseLetter)
                .map(unwrapDomainResult)

            setCurrentGame(unwrapDomainResult(gameService.processGuess(currentGame, letters)))
        } catch(e) {
            if(e instanceof Error) {
                alert(e.message)
            } else {
                alert("Caught something that isn't an Error...")
            }
        } finally {
            form.reset()
        }

        return;
    }

    let gameInput;

    if(currentGame.finished) {
        gameInput = GameOver({resetHandler: () => { setCurrentGame(newGame()) }})
    } else {
        gameInput = GuessForm({submitHandler: handleSubmit})
    }

    return (
        <div className="game">
            <div className="game-progress">
                {currentGame.attempts.map( (xxx, index) => <AttemptElement id={`attempt-${index}`} letters={xxx.letterAttempts} />)}
            </div>
            { gameInput }
        </div>
    );
}

type GuessFormProps = { submitHandler: (e: FormEvent) => void}

function GuessForm({submitHandler} : GuessFormProps) {
    function handleOnFocus(event: React.FocusEvent): void {
        const input = event.target as HTMLInputElement
        input.value = ''
        return;
    }

    function handleOnInput(id: string) {
        return (event: React.FormEvent): void => {
            const input = event.target as HTMLInputElement
            let trimmed = input.value.trim()

            if(trimmed.length > 0) {
                input.value = input.value[trimmed.length - 1] || '';

                if(window?.document) {
                    const element = window.document.getElementById(id)
                    if(element) {
                        element.focus();
                    }
                }
            } else {
                input.value = trimmed
            }
            return;
        }
    }

    const augmentedSubmit: (e: FormEvent) => void = function (e: FormEvent): void {
        submitHandler(e)
        if(window?.document) {
            const element = window.document.getElementById('letter1')
            if(element) {
                element.focus();
            }
        }
    }

    return(
        <div className="game-control">
            <form method="post" onSubmit={augmentedSubmit}>
                <input id={'letter1'} name="letter1" className="letter" onFocus={handleOnFocus} onInput={handleOnInput('letter2')} />
                <input id={'letter2'} name="letter2" className="letter" onFocus={handleOnFocus} onInput={handleOnInput('letter3')} />
                <input id={'letter3'} name="letter3" className="letter" onFocus={handleOnFocus} onInput={handleOnInput('letter4')} />
                <input id={'letter4'} name="letter4" className="letter" onFocus={handleOnFocus} onInput={handleOnInput('letter5')} />
                <input id={'letter5'} name="letter5" className="letter" onFocus={handleOnFocus} onInput={handleOnInput('submitAttempt')} />
                <button id={'submitAttempt'} type="submit" >Guess</button>
            </form>
        </div>
    );
}

type GameOverProps = { resetHandler: () => void}

function GameOver({resetHandler}: GameOverProps) {
    return (
        <div className="game-control">
            <span className="game-over">GAME OVER</span>
            <br/>
            <button onClick={resetHandler}>New Game</button>
    </div>);
}