import React, {FormEvent, useState} from 'react';
import { createGameService } from "@wordle/domain/gameServiceImpl.js";
import { createMemoryGameRepository } from "@wordle/domain/adapter/memoryGameRepository.js";
import {Game} from "@wordle/domain/game.js";
import {unwrapResult} from "@wordle/domain/result.js";

import './style.css'
import {Letter, parseLetter} from "@wordle/domain/letter.js";

import { Attempt as AttemptElement } from "./Attempt.js";

const gameService = createGameService(createMemoryGameRepository());

export default function App() {

    const newGame: () => Game = () => {
        return unwrapResult(gameService.createGame())
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
                .map(unwrapResult)

            setCurrentGame(unwrapResult(gameService.processGuess(currentGame, letters)))
        } catch(e) {
            if(e instanceof Error) {
                alert("Each input can only take a single letter")
            }
        } finally {
            form.reset()
            // move focus to the first input box?
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

    return(
        <div className="game-control">
            <form method="post" onSubmit={submitHandler}>
                <input name="letter1" className="letter" onFocus={handleOnFocus} />
                <input name="letter2" className="letter" onFocus={handleOnFocus} />
                <input name="letter3" className="letter" onFocus={handleOnFocus} />
                <input name="letter4" className="letter" onFocus={handleOnFocus} />
                <input name="letter5" className="letter" onFocus={handleOnFocus} />
                <button type="submit">Guess</button>
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