import { PrismaClient } from "@prisma/client"

export const prisma = new PrismaClient();

export class Database {
    static async connect(): Promise<void> {
        await prisma.$connect();
    }

    static async disconnect(): Promise<void> {
        await prisma.$disconnect();
    }
} 