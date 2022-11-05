import { FastifyInstance } from 'fastify';
import { userController } from 'src';

export async function userRoutes(app: FastifyInstance) {
    app.get('/users/count', async () => {
        return { count: await userController.count() };
    });
}