import { PrismaPg } from '@prisma/adapter-pg';
import { Config } from 'src/config/config';
import { PrismaClient } from 'src/prisma/generated/client';

const adapter = new PrismaPg({ connectionString: Config.database_url });
const prisma = new PrismaClient({
  adapter,
  transactionOptions: {
    timeout: 15000
  }
});

export { prisma };
export * from 'src/prisma/generated/client';
