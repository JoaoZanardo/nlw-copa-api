import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

(async () => {
    await prisma.guess.deleteMany();
    await prisma.participant.deleteMany();
    await prisma.user.deleteMany();
    await prisma.poll.deleteMany();
    await prisma.game.deleteMany();

    const user = await prisma.user.create({
        data: {
            name: 'Jonh Doe',
            email: 'jonh.doe@mail.com',
            googleId: 'FAKE-GOOGLE-ID',
            avatarUrl: 'avatar.url.com',
        }
    });

    const poll = await prisma.poll.create({
        data: {
            title: 'Poll master',
            code: 'FAKE-CODE',
            ownerId: user.id,

            participants: {
                create: {
                    userId: user.id
                }
            }
        }
    });

    await prisma.game.create({
        data: {
            date: '2022-11-03T12:00:00.637Z',
            firstTeamCountryCode: 'DE',
            secondTeamCountryCode: 'BR',
        }
    });

    await prisma.game.create({
        data: {
            date: '2022-12-05T12:00:00.637Z',
            firstTeamCountryCode: 'BR',
            secondTeamCountryCode: 'AR',

            guesses: {
                create: {
                    firstTeamPoints: 2,
                    secondTeamPoint: 1,

                    participant: {
                        connect: {
                            userId_pollId: {
                                userId: user.id,
                                pollId: poll.id
                            }
                        }
                    }
                }
            }
        }
    });
})();