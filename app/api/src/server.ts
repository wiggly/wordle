import express from "express";
import { createGameService } from "@wordle/domain/gameServiceImpl.js";
import { createMemoryGameRepository } from "@wordle/memory-repository/adapter/memoryGameRepository.js";
import { createHttpGameService } from "@wordle/domain/adapter/httpGameService.js";

const gameService = createGameService(createMemoryGameRepository());

const app = express();
app.use(express.urlencoded());
app.use(express.json());

//const routes = createHttpGameService(gameService, app);
createHttpGameService(gameService, app);

const port = process.env["PORT"] || 3000;

//const server = app.listen(port, () => {
//    console.log(`Listening at http://localhost:${port}`);
//});
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});
