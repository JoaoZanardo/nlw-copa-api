import { string, z } from 'zod'
import ShortUniqueId from 'short-unique-id';
import { prisma } from '../lib/prisma';
import { FastifyInstance } from 'fastify';
import authenticate from '../plugins/authenticate';

export async function poolRoutes(app: FastifyInstance) {
    app.get('/polls/count', async () => {
        return { count: await prisma.poll.count() };
    });

    app.post('/polls', async (req, reply) => {
        const createpollBody = z.object({
            title: z.string(),
        });

        const { title } = createpollBody.parse(req.body);
        const generate = new ShortUniqueId({ length: 24 });
        const code = String(generate()).toUpperCase();

        try {
            await req.jwtVerify();

            await prisma.poll.create({
                data: {
                    title,
                    code,
                    ownerId: req.user.sub,
                    participants: {
                        create: {
                            userId: req.user.sub
                        }
                    }
                }
            });
        } catch (error) {
            await prisma.poll.create({
                data: {
                    title,
                    code
                }
            });
        }

        reply.status(201).send({ code });
    });

    app.post('/polls/join', {
        onRequest: authenticate
    }, async (req, reply) => {
        const joinPollBody = z.object({
            code: string()
        });

        const { code } = joinPollBody.parse(req.body);

        const poll = await prisma.poll.findUnique({
            where: {
                code
            },
            include: {
                participants: {
                    where: {
                        userId: req.user.sub
                    }
                }
            }
        });

        if (!poll) return reply.status(404).send({
            message: 'Poll not found'
        });

        if (poll.participants.length > 0) return reply.status(400).send({
            message: 'You already joined this poll'
        });

        console.log({ poll }, req.user.sub)
        if (!poll.ownerId) {
            await prisma.poll.update({
                where: {
                    id: poll.id
                },
                data: {
                    ownerId: req.user.sub
                }
            })
        }

        await prisma.participant.create({
            data: {
                pollId: poll.id,
                userId: req.user.sub
            }
        });

        return reply.status(201).send();
    });

    app.get('/polls', {
        onRequest: authenticate
    }, async (req) => {
        const polls = await prisma.poll.findMany({
            where: {
                participants: {
                    some: {
                        userId: req.user.sub
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

        return { polls };
    });

    app.get('/polls/:id', {
        onRequest: authenticate
    }, async (req) => {
        const getPollParams = z.object({
            id: string()
        });

        const { id } = getPollParams.parse(req.params);

        const poll = await prisma.poll.findUnique({
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

        return { poll };
    });
}