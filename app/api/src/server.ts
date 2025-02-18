import express from "express";
import { createGameService } from "@wordle/domain/gameServiceImpl.js";
import { createMemoryGameRepository } from "@wordle/memory-repository/adapter/memoryGameRepository.js";
import { createHttpGameService } from "@wordle/rest-service/adapter/restGameService.js";

const gameService = createGameService(createMemoryGameRepository());

const app = express();
app.use(express.urlencoded());
app.use(express.json());

createHttpGameService(gameService, app);

const port = process.env["PORT"] || 3000;

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});
