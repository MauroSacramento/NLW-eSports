import express from 'express';
import { PrismaClient } from './generated/prisma';

const app = express()
const prisma = new PrismaClient()

app.get("/games", async (req, res) => {
    const games = prisma.game.findMany();

    res.json(games);
});

app.post("(ads", (req, res) => {
    res.status(201).json([]);
})

app.get("/games/:id/ads", (req, res) => {
    // const gameId = req.params.id

    res.json([
        {id: 1, name: 'Anúncio 1'},
        {id: 2, name: 'Anúncio 2'},
        {id: 3, name: 'Anúncio 3'},
        {id: 4, name: 'Anúncio 4'},
    ])
})

app.listen(3333, ()=> {
    console.log("Servidor rodando na porta 3333")
}) 