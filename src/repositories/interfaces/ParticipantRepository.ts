import { Participant } from "@prisma/client";
import { CreateParticipantDTO } from "../dto/createParticipant.dto";

export interface ParticipantRepository {
    create(data: CreateParticipantDTO): Promise<Participant>;
    findOneByPollIdAndUserId(pollId: string, userId: string): Promise<Participant | null>;
}