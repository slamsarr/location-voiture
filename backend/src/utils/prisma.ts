/**
 * Singleton PrismaClient
 * ----------------------
 * Un seul client Prisma est partagé entre tous les modules pour éviter
 * l'épuisement du pool de connexions (particulièrement critique avec SQLite).
 */
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
