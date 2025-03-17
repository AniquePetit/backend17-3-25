import { PrismaClient } from '@prisma/client';

// Maak een nieuwe instantie van PrismaClient
const prisma = new PrismaClient();

// Zorg ervoor dat Prisma wordt geëxporteerd als default export
export default prisma;