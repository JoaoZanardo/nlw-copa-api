import { Game, Guess } from "@prisma/client";

export interface GameRepository {
    findAllWithGuessesFromAPoll(userId: string, pollId: string): Promise<(Game & { guesses: Guess[] })[]>;
    findOne(id: string): Promise<Game | null>
}