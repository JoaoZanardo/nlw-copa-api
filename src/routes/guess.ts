import { FastifyInstance } from 'fastify';
import authenticate from '../plugins/authenticate';
import { guessController } from '../index';

export async function guessRoutes(app: FastifyInstance) {
    app.get('/guesses/count', async () => {
        return { count: await guessController.count() };
    });

    app.post('/polls/:pollId/games/:gameId', {
        onRequest: authenticate
    }, async (req, reply) => {
        return await guessController.create(req, reply);
    });
}