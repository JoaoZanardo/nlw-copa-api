import Fastify from "fastify";
import cors from '@fastify/cors';
import { poolRoutes } from "./routes/poll";
import { guessRoutes } from "./routes/guess";
import { userRoutes } from "./routes/user";
import { gameRoutes } from "./routes/game";
import { authRoutes } from "./routes/auth";
import jwt from "@fastify/jwt";

const app = Fastify({
    logger: true
});

app.register(cors, {
    origin: true,
});

(async () => {
    await app.register(jwt, {
        secret: 'NLW-COPA'
    });
    await app.register(poolRoutes);
    await app.register(guessRoutes);
    await app.register(userRoutes);
    await app.register(gameRoutes);
    await app.register(authRoutes);
})();

export { app };