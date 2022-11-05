import { Participant, PrismaClient } from "@prisma/client";
import { CreateParticipantDTO } from "../dto/createParticipant.dto";
import { ParticipantRepository } from "../interfaces/ParticipantRepository";

export class PrismaParticipantRepository implements ParticipantRepository {
    constructor(private prisma: PrismaClient) { }

    async create(data: CreateParticipantDTO): Promise<Participant> {
        return await this.prisma.participant.create({
            data
        });
    }

    async findOneByPollIdAndUserId(pollId: string, userId: string): Promise<Participant | null> {
        return await this.prisma.participant.findUnique({
            where: {
                userId_pollId: {
                    pollId,
                    userId
                }
            }
        });
    }
}