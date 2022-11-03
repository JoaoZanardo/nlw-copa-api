import { prisma } from '../lib/prisma';
import { FastifyInstance } from 'fastify';

export async function userRoutes(app: FastifyInstance) {
    app.get('/users/count', async () => {
        return { count: await prisma.user.count() };
    });
}