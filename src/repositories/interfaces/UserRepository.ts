import { User } from "@prisma/client";
import { CreateUserDTO } from "../dto/createUser.dto";

export interface UserRepository {
    count(): Promise<number>;
    create(data: CreateUserDTO): Promise<User>;
    findOneByGoogleId(googleId: string): Promise<User | null>;
}