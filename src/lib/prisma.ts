import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '.prisma/client';
import env from 'src/config/env';

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export default prisma;
