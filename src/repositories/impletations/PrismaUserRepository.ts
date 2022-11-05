import { PrismaClient, User } from "@prisma/client";
import { CreateUserDTO } from "../dto/createUser.dto";
import { UserRepository } from "../interfaces/UserRepository";


export class PrismaUserRepository implements UserRepository {
    constructor(private prisma: PrismaClient) { }

    async count(): Promise<number> {
        return await this.prisma.user.count();
    }

    async create(data: CreateUserDTO): Promise<User> {
        return await this.prisma.user.create({ data });
    }

    async findOneByGoogleId(googleId: string): Promise<User | null> {
        return await this.prisma.user.findUnique({
            where: {
                googleId
            }
        });
    }
}