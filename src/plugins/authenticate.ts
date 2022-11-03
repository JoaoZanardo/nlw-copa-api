import { FastifyRequest } from "fastify";

export default (async (req: FastifyRequest) => {
    await req.jwtVerify();
})