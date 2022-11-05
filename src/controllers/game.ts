import { FastifyReply, FastifyRequest } from "fastify";
import { GameRepository } from "../repositories/interfaces/GameRepository";
import { z } from "zod";
import { InternalError } from "src/utils/errors/internalError";

export class GameController {
    constructor(private gameRepository: GameRepository) { }

    async getAllWithGuessesFromAPoll(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        try {
            const getPollParams = z.object({
                pollId: z.string()
            });

            const { pollId } = getPollParams.parse(req.params);

            const games = await this.gameRepository.findAllWithGuessesFromAPoll(pollId, req.user.sub);
            return reply.status(200).send({
                games: games.map(game => {
                    return {
                        ...game,
                        guess: game.guesses.length > 0 ? game.guesses[0] : null,
                        guesses: undefined
                    }
                })
            });
        } catch (err) {
            const { message } = err as Error
            throw new InternalError(message);
        }
    }
}