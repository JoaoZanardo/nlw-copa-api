import { Game, Guess, PrismaClient } from "@prisma/client";
import { GameRepository } from "../interfaces/GameRepository";

export class PrismaGameRepository implements GameRepository {
    constructor(private prisma: PrismaClient) { }

    async findAllWithGuessesFromAPoll(userId: string, pollId: string): Promise<(Game & { guesses: Guess[] })[]> {
        return await this.prisma.game.findMany({
            orderBy: {
                date: 'desc'
            },
            include: {
                guesses: {
                    where: {
                        participant: {
                            userId,
                            pollId
                        }
                    }
                }
            }
        });
    }

    async findOne(id: string): Promise<Game | null> {
        return await this.prisma.game.findUnique({
            where: {
                id
            }
        });
    }
}