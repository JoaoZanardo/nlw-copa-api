import Fastify, { FastifyInstance, FastifyServerFactory } from "fastify";
import cors from '@fastify/cors';
import { poolRoutes } from "./routes/poll";
import { guessRoutes } from "./routes/guess";
import { userRoutes } from "./routes/user";
import { gameRoutes } from "./routes/game";
import { authRoutes } from "./routes/auth";
import jwt from "@fastify/jwt";
import { Database } from "./database";

export class App {
    constructor(
        private app: FastifyInstance = Fastify({ logger: true }),
        private port: number = 3000,
        private host: string = '0.0.0.0'
    ) { }

    getApp(): FastifyInstance {
        return this.app;
    }

    async init(): Promise<void> {
        await this.setupFastify();
        await this.setupRoutes();
    }

    async setupFastify(): Promise<void> {
        await this.app.register(cors, {
            origin: true
        });

        await this.app.register(jwt, {
            secret: 'NLW-COPA'
        });
    }

    async setupRoutes(): Promise<void> {
        await this.app.register(poolRoutes);
        await this.app.register(guessRoutes);
        await this.app.register(userRoutes);
        await this.app.register(gameRoutes);
        await this.app.register(authRoutes);
    }

    async close(): Promise<void> {
        await Database.disconnect();
        await this.app.close();
    }

    async start(): Promise<void> {
        await this.app.listen({ port: this.port, host: this.host });
    }
}