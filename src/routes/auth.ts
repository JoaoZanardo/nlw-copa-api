import { FastifyInstance } from 'fastify';
import authenticate from '../plugins/authenticate';
import { userController } from '../index';

export async function authRoutes(app: FastifyInstance) {
    app.get('/me', {
        onRequest: authenticate
    }, async (req) => {
        return { user: req.user };
    });

    app.post('/users', async (req) => {
        return { token: await userController.create(req, app) };
    });
}