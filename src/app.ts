import Fastify, { FastifyInstance } from "fastify";
import cors from '@fastify/cors';
import { poolRoutes } from "./routes/poll";
import { guessRoutes } from "./routes/guess";
import { userRoutes } from "./routes/user";
import { gameRoutes } from "./routes/game";
import { authRoutes } from "./routes/auth";
import jwt from "@fastify/jwt";
import { Database } from "./database";
import dotenv from 'dotenv';

export class App {
    constructor(
        private app: FastifyInstance = Fastify({ logger: true }),
        private port: number = Number(process.env.PORT),
        private host: string = String(process.env.HOST)
    ) { }

    getApp(): FastifyInstance {
        return this.app;
    }

    async init(): Promise<void> {
        await this.setupFastify();
        await this.setupRoutes();
    }

    async setupFastify(): Promise<void> {
        dotenv.config();
        
        await this.app.register(cors, {
            origin: true
        });

        await this.app.register(jwt, {
            secret: String(process.env.SECRET_JWT_KEY),
            
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