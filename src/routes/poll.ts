import { FastifyInstance } from 'fastify';
import { pollController } from '../index';
import authenticate from '../plugins/authenticate';

export async function poolRoutes(app: FastifyInstance) {
    app.get('/polls/count', async () => {
        return { count: await pollController.count() };
    });

    app.post('/polls', async (req, reply) => {
        await pollController.create(req, reply)
    });

    app.post('/polls/join', {
        onRequest: authenticate
    }, async (req, reply) => {
        await pollController.joinInAPoll(req, reply)
    });

    app.get('/polls', {
        onRequest: authenticate
    }, async (req, reply) => {
        await pollController.getAllForUser(req, reply);
    });

    app.get('/polls/:id', {
        onRequest: authenticate
    }, async (req, reply) => {
        await pollController.getOne(req, reply);
    });
}