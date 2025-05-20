import { Identifier } from './../node_modules/acorn/dist/acorn.d';
import express from 'express';
import cors from 'cors'

import { PrismaClient } from './generated/prisma'
import { convertHourToMinute } from './utils/convertHourToString';
import { convertMinuteToHour } from './utils/convertMinuteToHour';

const app = express()

app.use(cors())
app.use(express.json());

const prisma = new PrismaClient()


app.get("/games", async (req, res) => {
    const games = await prisma.game.findMany({
        include: {
            _count: {
                select: {
                    ads: true
                }
            }
        }
    });

    res.json(games);
});

app.post("/games/:id/ads", async (req, res) => {
    const gameId = req.params.id;
    
    const {name, yearsPlaying, discord, weekDays, hourStart, hourEnd, useVoiceChannel} = req.body;

    const data = {
        gameId,
        name,
        yearsPlaying,
        discord,
        weekDays: weekDays.join(','),
        hourStart: convertHourToMinute(hourStart),
        hourEnd: convertHourToMinute(hourEnd),
        useVoiceChannel
    }

    const ad = await prisma.ad.create({data})

    res.status(201).json({
        data: data
    });
})

app.get("/games/:id/ads", async (req, res) => {
    const gameId = req.params.id

    const ads = await prisma.ad.findMany({
        select: {
            id: true,
            name: true,
            weekDays: true,
            useVoiceChannel: true,
            yearsPlaying: true,
            hourStart: true,
            hourEnd: true,
        },
        where: {
            gameId,
        },
        orderBy: {
            createAt: 'desc'
        }
    })

    res.json(ads.map(ad => {
        return {
            ...ad,
            weekDays: ad.weekDays.split(','),
            hourStart: convertMinuteToHour(ad.hourStart),
            hourEnd: convertMinuteToHour(ad.hourEnd)
        }
    }))
})

app.get("/ads/:id/discord", async (req, res) => {
    
    const adId = req.params.id;
    
    const ad = await prisma.ad.findUniqueOrThrow({
        select: {
            discord: true,
        },
        where: {
            id: adId,
        }
    })

    res.json({
        discord: ad.discord
    })
})

// app.all('/*splat', (request, response) => {
//     response.status(404).json({
//         message: "The URL does not exist"
//     })
// })


app.listen(3333, ()=> {
    console.log("Servidor rodando na porta 3333")
}) 