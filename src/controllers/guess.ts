import { FastifyReply, FastifyRequest } from "fastify";
import { GameRepository } from "../repositories/interfaces/GameRepository";
import { GuessRepository } from "../repositories/interfaces/GuessRepository";
import { ParticipantRepository } from "../repositories/interfaces/ParticipantRepository";
import { z } from "zod";

export class GuessesController {
    constructor(
        private gameRepository: GameRepository,
        private guessRepository: GuessRepository,
        private participantRepository: ParticipantRepository
    ) { }

    async count(): Promise<number> {
        return await this.guessRepository.count();
    }

    async create(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        const createGuessParams = z.object({
            pollId: z.string(),
            gameId: z.string()
        });

        const createGuessBody = z.object({
            firstTeamPoints: z.number(),
            secondTeamPoint: z.number()
        })

        const { pollId, gameId } = createGuessParams.parse(req.params);
        const { firstTeamPoints, secondTeamPoint } = createGuessBody.parse(req.body);

        const participant = await this.participantRepository.findOneByPollIdAndUserId(pollId, req.user.sub);

        if (!participant) return reply.status(400).send({
            message: 'You are not allowed to create a guess inside this poll'
        });

        const guess = await this.guessRepository.findOneByParticipantIdAndGameId(participant.id, gameId)

        if (guess) return reply.status(400).send({
            message: 'You already sent a guess to this poll'
        });

        const game = await this.gameRepository.findOne(gameId);

        if (!game) return reply.status(404).send({
            message: 'Game not found'
        });

        if (game.date < new Date()) return reply.status(400).send({
            message: 'You cannot send guesses after the game date'
        });

        const newGuess = await this.guessRepository.create({
            gameId,
            participantId: participant.id,
            firstTeamPoints,
            secondTeamPoint
        });

        return reply.status(201).send({
            guess: newGuess
        });
    }
}