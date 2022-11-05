import { prisma } from "./database";
import { PrismaGameRepository } from "./repositories/impletations/PrismaGameRepository";
import { PrismaGuessRepository } from "./repositories/impletations/PrismaGuessRepository";
import { PrismaParticipantRepository } from "./repositories/impletations/PrismaParticipantRepository";
import { PrismaPollRepository } from "./repositories/impletations/PrismaPollRepository";
import { PrismaUserRepository } from "./repositories/impletations/PrismaUserRepository";
import { GuessesController } from "./controllers/guess";
import { PollsController } from "./controllers/poll";
import { GameController } from "./controllers/game";
import { UserController } from "./controllers/user";

export const userRepository = new PrismaUserRepository(prisma);
export const gameRepository = new PrismaGameRepository(prisma);
export const guessRepository = new PrismaGuessRepository(prisma);
export const participantRepository = new PrismaParticipantRepository(prisma)

export const pollController = new PollsController(
    new PrismaPollRepository(prisma),
    participantRepository
);

export const guessController = new GuessesController(
    gameRepository,
    guessRepository,
    participantRepository
);

export const gameController = new GameController(gameRepository);

export const userController = new UserController(userRepository);