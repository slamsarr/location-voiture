"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
/**
 * Singleton PrismaClient
 * ----------------------
 * Un seul client Prisma est partagé entre tous les modules pour éviter
 * l'épuisement du pool de connexions (particulièrement critique avec SQLite).
 */
const client_1 = require("@prisma/client");
const globalForPrisma = globalThis;
exports.prisma = globalForPrisma.prisma ??
    new client_1.PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    });
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = exports.prisma;
}
