import { prisma } from '../lib/prisma';
import { FastifyInstance } from 'fastify';
import authenticate from '../plugins/authenticate';
import { string, z } from 'zod';

export async function guessRoutes(app: FastifyInstance) {
    app.get('/guesses/count', async () => {
        return { count: await prisma.guess.count() };
    });

    app.post('/polls/:pollId/games/:gameId', {
        onRequest: authenticate
    }, async (req, reply) => {
        const createGuessParams = z.object({
            pollId: string(),
            gameId: string()
        });

        const createGuessBody = z.object({
            firstTeamPoints: z.number(),
            secondTeamPoint: z.number()
        })

        const { pollId, gameId } = createGuessParams.parse(req.params);
        const { firstTeamPoints, secondTeamPoint } = createGuessBody.parse(req.body);

        const participant = await prisma.participant.findUnique({
            where: {
                userId_pollId: {
                    pollId,
                    userId: req.user.sub
                }
            }
        });

        if (!participant) return reply.status(400).send({
            message: 'You are not allowed to create a guess inside this poll'
        });

        const guess = await prisma.guess.findUnique({
            where: {
                participantId_gameId: {
                    participantId: participant.id,
                    gameId
                }
            }
        });

        if (guess) return reply.status(400).send({
            message: 'You already sent a guess to this poll'
        });

        const game = await prisma.game.findUnique({
            where: {
                id: gameId
            }
        });

        if (!game) return reply.status(404).send({
            message: 'Game not found'
        });

        if (game.date < new Date()) return reply.status(400).send({
            message: 'You cannot send guesses after the game date'
        });

        await prisma.guess.create({
            data: {
                gameId,
                participantId: participant.id,
                firstTeamPoints,
                secondTeamPoint
            }
        });

        return {
            pollId,
            gameId,
            firstTeamPoints,
            secondTeamPoint
        };
    });
}