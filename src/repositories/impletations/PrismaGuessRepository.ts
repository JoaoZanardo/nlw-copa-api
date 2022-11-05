import { Guess, PrismaClient } from "@prisma/client";
import { createGuessesDTO } from "../dto/createGuess.dto";
import { GuessRepository } from "../interfaces/GuessRepository";

export class PrismaGuessRepository implements GuessRepository {
    constructor(private prisma: PrismaClient) { }

    async count(): Promise<number> {
        return await this.prisma.guess.count();
    }

    async findOneByParticipantIdAndGameId(participantId: string, gameId: string): Promise<Guess | null> {
        return await this.prisma.guess.findUnique({
            where: {
                participantId_gameId: {
                    participantId,
                    gameId
                }
            }
        });
    }

    async create(data: createGuessesDTO): Promise<Guess> {
        return await this.prisma.guess.create({
            data
        });
    }
}