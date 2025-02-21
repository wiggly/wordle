import express from "express";
import { createGameService } from "@wordle/domain/gameServiceImpl.js";
import { MemoryGameRepository } from "@wordle/memory-game-repository/adapter/memoryGameRepository.js";
import { createHttpGameService } from "@wordle/rest-game-service/adapter/restGameService.js";
import {Configuration} from "@wordle/domain/configuration.js";

const maxAttemptsStr: string = process.env['MAX_ATTEMPTS'] || '5'
const maxAttemptsNumber = parseInt(maxAttemptsStr)

if(Number.isNaN(maxAttemptsNumber)) {
    throw new Error(`Configuration error - cannot parse ${maxAttemptsStr} as a number`)
}

const configuration: Configuration = {
    maxAttempts: maxAttemptsNumber
}

const app = express();
app.use(express.urlencoded());
app.use(express.json());

const gameService = createGameService(new MemoryGameRepository(configuration.maxAttempts));

createHttpGameService(gameService, app);

const port = process.env["PORT"] || 3000;

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});
