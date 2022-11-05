import { Participant, Poll } from "@prisma/client";
import { CreatePollDTO } from "../dto/createPoll.dto";

export interface PollRepository {
    count(): Promise<number>
    create(data: CreatePollDTO): Promise<Poll>;
    update(id: string, data: Partial<CreatePollDTO>): Promise<Poll>
    findAll(): Promise<Poll[]>;
    findAllForUser(userId: string): Promise<Poll[]>;
    findOneById(id: string): Promise<Poll | null>;
    findOneWithParticipants(pollId: string, userId: string): Promise<(Poll & { participants: Participant[] }) | null>;
}