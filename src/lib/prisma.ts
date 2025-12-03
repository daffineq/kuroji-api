import { PrismaPg } from '@prisma/adapter-pg';
import env from 'src/config/env';
import { PrismaClient } from 'src/prisma/generated/client';

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export { prisma };
export * from 'src/prisma/generated/client';
