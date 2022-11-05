import { Participant, Poll, PrismaClient } from "@prisma/client";
import { CreatePollDTO } from "../dto/createPoll.dto";
import { PollRepository } from "../interfaces/PollRepository";

export class PrismaPollRepository implements PollRepository {
    constructor(private prisma: PrismaClient) { }

    async count(): Promise<number> {
        return await this.prisma.poll.count();
    }

    async create(data: CreatePollDTO): Promise<Poll> {
        if (data.ownerId) return await this.prisma.poll.create({
            data: {
                ...data,
                participants: {
                    create: {
                        userId: data.ownerId
                    }
                }
            }
        })

        return this.prisma.poll.create({
            data: {
                title: data.title,
                code: data.code
            }
        });
    }

    async update(id: string, data: Partial<CreatePollDTO>): Promise<Poll> {
        return await this.prisma.poll.update({
            where: {
                id
            },
            data
        });
    }

    async findAll(): Promise<Poll[]> {
        return await this.prisma.poll.findMany({
            include: {
                _count: {
                    select: {
                        participants: true
                    }
                },
                participants: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                avatarUrl: true
                            }
                        }
                    },
                    take: 4
                },
                owner: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
    }

    async findAllForUser(userId: string): Promise<Poll[]> {
        return await this.prisma.poll.findMany({
            where: {
                participants: {
                    some: {
                        userId
                    }
                }
            },
            include: {
                _count: {
                    select: {
                        participants: true
                    }
                },
                participants: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                avatarUrl: true
                            }
                        }
                    },
                    take: 4
                },
                owner: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
    }

    async findOneById(id: string): Promise<Poll | null> {
        return await this.prisma.poll.findUnique({
            where: {
                id
            },
            include: {
                _count: {
                    select: {
                        participants: true
                    }
                },
                participants: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                avatarUrl: true
                            }
                        }
                    },
                    take: 4
                },
                owner: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
    }

    async findOneWithParticipants(code: string, userId: string): Promise<(Poll & {
        participants: Participant[];
    }) | null> {
        return await this.prisma.poll.findUnique({
            where: {
                code
            },
            include: {
                participants: {
                    where: {
                        userId
                    }
                }
            }
        });
    }
}