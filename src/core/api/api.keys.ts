import crypto, { createHash } from 'crypto';
import { Context } from 'hono';
import { Module } from 'src/helpers/module';
import { prisma, Prisma } from 'src/lib/prisma';

class ApiKeysModule extends Module {
  override readonly name = 'ApiKeys';

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

    const ip =
      c.req.header('cf-connecting-ip') ??
      c.req.header('x-forwarded-for') ??
      c.req.header('x-real-ip') ??
      '127.0.0.1';

    await prisma.apiKeyUsage.create({
      data: {
        api_key_id: apiKey.id,
        endpoint: c.req.path,
        method: c.req.method,
        origin: c.req.header('origin') ?? undefined,
        user_agent: c.req.header('user-agent') ?? undefined,
        ip
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

const ApiKeys = new ApiKeysModule();

export { ApiKeys, ApiKeysModule };
