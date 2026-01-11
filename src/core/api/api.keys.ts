import crypto, { createHash } from 'crypto';
import { apiKey, apiKeyUsage, db } from 'src/db';
import { Module } from 'src/helpers/module';

class ApiKeysModule extends Module {
  override readonly name = 'ApiKeys';

  async generate(): Promise<string> {
    const key = crypto.randomBytes(32).toString('base64url');
    const hashed = createHash('sha256').update(key).digest('hex');

    await db
      .insert(apiKey)
      .values({
        key: hashed
      })
      .onConflictDoNothing({
        target: apiKey.key
      });

    return key;
  }

  async validate(key: string): Promise<boolean> {
    const hashed = createHash('sha256').update(key).digest('hex');
    const first = await db.query.apiKey.findFirst({
      where: {
        key: hashed
      }
    });

    return !!first;
  }

  async used(key: string, request: Request) {
    const hashed = createHash('sha256').update(key).digest('hex');

    const first = await db.query.apiKey.findFirst({
      where: {
        key: hashed
      }
    });

    if (!first) return;

    const ip =
      request.headers.get('cf-connecting-ip') ??
      request.headers.get('x-forwarded-for') ??
      request.headers.get('x-real-ip') ??
      '127.0.0.1';

    await db.insert(apiKeyUsage).values({
      api_key_id: first.id,
      endpoint: new URL(request.url).pathname,
      method: request.method,
      origin: request.headers.get('origin') ?? undefined,
      user_agent: request.headers.get('user-agent') ?? undefined,
      ip
    });
  }

  async get(key: string) {
    const hashed = createHash('sha256').update(key).digest('hex');

    return db.query.apiKey.findFirst({
      where: {
        key: hashed
      },
      with: {
        usage: true
      }
    });
  }
}

const ApiKeys = new ApiKeysModule();

export { ApiKeys, ApiKeysModule };
