import { Config } from 'src/config';
import redis from 'src/lib/redis';

class RedisModule {
  async set(key: string, value: any, ttlSeconds: number | undefined = Config.redis_ttl) {
    if (!Config.caching_enabled || !redis) return;

    const data = typeof value === 'string' ? value : JSON.stringify(value);

    if (ttlSeconds) {
      await redis.set(key, data, 'EX', ttlSeconds);
    } else {
      await redis.set(key, data);
    }
  }

  async get<T = any>(key: string): Promise<T | null> {
    if (!Config.caching_enabled || !redis) return null;

    const data = await redis.get(key);

    if (!data) return null;

    try {
      return JSON.parse(data) as T;
    } catch {
      return data as unknown as T;
    }
  }

  async getset<T = any>(key: string, value: any): Promise<T | null> {
    if (!Config.caching_enabled || !redis) return null;

    const data = await redis.getset(key, value);

    if (!data) return null;

    try {
      return JSON.parse(data) as T;
    } catch {
      return data as unknown as T;
    }
  }

  async del(...key: string[]) {
    if (!Config.caching_enabled || !redis) return;

    await redis.del(key);
  }

  async sadd(key: string, ...members: (string | number)[]) {
    if (!Config.caching_enabled || !redis) return;

    await redis.sadd(key, members);
  }

  async smembers(key: string) {
    if (!Config.caching_enabled || !redis) return;

    return await redis.smembers(key);
  }

  async incr(key: string) {
    if (!Config.caching_enabled || !redis) return;

    return await redis.incr(key);
  }

  async decr(key: string) {
    if (!Config.caching_enabled || !redis) return;

    return await redis.decr(key);
  }

  async expire(key: string, ttlSeconds: number) {
    if (!Config.caching_enabled || !redis) return;

    return await redis.expire(key, ttlSeconds);
  }

  async ttl(key: string) {
    if (!Config.caching_enabled || !redis) return;

    return await redis.ttl(key);
  }

  async exists(key: string) {
    if (!Config.caching_enabled || !redis) return;

    return await redis.exists(key);
  }
}

export const getKey = (...args: any[]) => {
  return args.join(':');
};

export const Redis = new RedisModule();
