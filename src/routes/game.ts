import { FastifyInstance } from 'fastify';
import authenticate from '../plugins/authenticate';
import { gameController } from '../index';

export async function gameRoutes(app: FastifyInstance) {
    app.get('/polls/:pollId/games', {
        onRequest: authenticate
    }, async (req, reply) => {
        return gameController.getAllWithGuessesFromAPoll(req, reply)
    });
}