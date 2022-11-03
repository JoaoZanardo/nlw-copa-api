import { prisma } from '../lib/prisma';
import { FastifyInstance } from 'fastify';
import authenticate from '../plugins/authenticate';
import { z } from 'zod';

export async function gameRoutes(app: FastifyInstance) {
    app.get('/polls/:id/games', {
        onRequest: authenticate
    }, async (req) => {
        const getPollParams = z.object({
            id: z.string()
        });

        const { id } = getPollParams.parse(req.params);

        const games = await prisma.game.findMany({
            orderBy: {
                date: 'desc'
            },
            include: {
                guesses: {
                    where: {
                        participant: {
                            userId: req.user.sub,
                            pollId: id
                        }
                    }
                }
            }
        });

        return {
            games: games.map(game => {
                return {
                    ...game,
                    guess: game.guesses ? game.guesses[0] : null,
                    guesses: undefined
                }
            })
        };
    });
}