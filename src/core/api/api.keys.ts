import { Prisma } from '@prisma/client';
import crypto, { createHash } from 'crypto';
import { Context } from 'hono';
import prisma from 'src/lib/prisma';

class ApiKeys {
  async generate(): Promise<string> {
    const key = crypto.randomBytes(32).toString('base64url');
    const hashed = createHash('sha256').update(key).digest('hex');

    await prisma.apiKey.create({
      data: {
        key: hashed
      }
    });

    return key;
  }

  async validate(key: string): Promise<boolean> {
    const hashed = createHash('sha256').update(key).digest('hex');
    const apiKey = await prisma.apiKey.findUnique({
      where: {
        key: hashed
      }
    });

    return !!apiKey;
  }

  async used(key: string, c: Context) {
    const hashed = createHash('sha256').update(key).digest('hex');

    const apiKey = await prisma.apiKey.findUnique({
      where: { key: hashed }
    });

    if (!apiKey) return;

    await prisma.apiKeyUsage.create({
      data: {
        apiKeyId: apiKey.id,
        endpoint: c.req.path,
        method: c.req.method,
        origin: c.req.header('origin') ?? undefined,
        userAgent: c.req.header('user-agent') ?? undefined,
        ip: c.req.header('x-forwarded-for') ?? c.req.raw.headers.get('cf-connecting-ip') ?? undefined
      }
    });
  }

  async get<T extends Prisma.ApiKeyDefaultArgs>(key: string, args?: T): Promise<Prisma.ApiKeyGetPayload<T>> {
    const hashed = createHash('sha256').update(key).digest('hex');

    return prisma.apiKey.findUnique({
      where: { key: hashed },
      ...(args as Prisma.ApiKeyDefaultArgs)
    }) as unknown as Prisma.ApiKeyGetPayload<T>;
  }
}

const apiKeys = new ApiKeys();

export default apiKeys;
