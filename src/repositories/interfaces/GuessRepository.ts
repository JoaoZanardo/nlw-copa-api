import { Guess, User } from "@prisma/client";
import { createGuessesDTO } from "../dto/createGuess.dto";

export interface GuessRepository {
    count(): Promise<number>;
    findOneByParticipantIdAndGameId(participantId: string, gameId: string): Promise<Guess | null>;
    create(data: createGuessesDTO): Promise<Guess>
}