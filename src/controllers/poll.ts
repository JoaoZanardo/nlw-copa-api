import { FastifyReply, FastifyRequest } from "fastify";
import ShortUniqueId from "short-unique-id";
import { z } from "zod";
import { PollRepository } from "../repositories/interfaces/PollRepository";
import { ParticipantRepository } from "../repositories/interfaces/ParticipantRepository";
import ApiError from "src/utils/errors/appError";
import { InternalError } from "src/utils/errors/internalError";

export class PollsController {
    constructor(
        private pollRepository: PollRepository,
        private participantRepository: ParticipantRepository) { }

    async count(): Promise<Number> {
        try {
            return await this.pollRepository.count();
        } catch (err) {
            const { message } = err as Error
            throw new InternalError(message);
        }
    }

    async create(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        try {
            const createpollBody = z.object({
                title: z.string(),
            });

            const { title } = createpollBody.parse(req.body);
            const generate = new ShortUniqueId({ length: 24 });
            const code = String(generate()).toUpperCase();

            try {
                await req.jwtVerify();
                await this.pollRepository.create({ title, code, ownerId: req.user.sub });
            } catch (e) {
                await this.pollRepository.create({ title, code });
            }

            return reply.status(201).send({ code });
        } catch (err) {
            const { message } = err as Error
            throw new InternalError(message);
        }
    }

    async joinInAPoll(req: FastifyRequest, reply: FastifyReply) {
        try {
            const joinPollBody = z.object({
                code: z.string()
            });

            const { code } = joinPollBody.parse(req.body);

            const poll = await this.pollRepository.findOneWithParticipants(code, req.user.sub);

            if (!poll) return reply.status(404).send(ApiError.format({
                code: 404,
                message: 'Poll not found'
            }));

            if (poll.participants.length > 0) return reply.status(400).send(ApiError.format({
                code: 400,
                message: 'You already joined this poll'
            }));

            if (!poll.ownerId) {
                await this.pollRepository.update(poll.id, { ownerId: req.user.sub });
            }

            await this.participantRepository.create({
                userId: req.user.sub,
                pollId: poll.id
            });

            return reply.status(201).send();
        } catch (err) {
            const { message } = err as Error
            throw new InternalError(message);
        }
    }

    async getAllForUser(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        try {
            const polls = await this.pollRepository.findAllForUser(req.user.sub);
            return reply.status(200).send({ polls });
        } catch (err) {
            const { message } = err as Error
            throw new InternalError(message);
        }
    }

    async getOne(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        try {
            const getPollParams = z.object({
                id: z.string()
            });
            const { id } = getPollParams.parse(req.params);

            const poll = await this.pollRepository.findOneById(id);

            return reply.status(200).send({ poll });
        } catch (err) {
            const { message } = err as Error
            throw new InternalError(message);
        }
    }
}