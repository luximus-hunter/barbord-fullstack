import { PrismaClient } from './app/generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import 'dotenv/config';

if (!process.env['DATABASE_URL']) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const db: PrismaClient =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter: new PrismaMariaDb(process.env['DATABASE_URL']),
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

export * from './app/generated/prisma/client';