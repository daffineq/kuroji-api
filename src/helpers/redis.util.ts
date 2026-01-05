import env from 'src/config/env';
import { providers } from 'src/core/anime/types';
import redis from 'src/lib/redis';

export const Redis = {
  async set(key: string, value: any, ttlSeconds: number = env.REDIS_TTL) {
    if (!env.REDIS_ENABLED) return;

    const data = typeof value === 'string' ? value : JSON.stringify(value);
    if (ttlSeconds) {
      await redis.set(key, data, 'EX', ttlSeconds);
    } else {
      await redis.set(key, data);
    }
  },

  async get<T = any>(key: string): Promise<T | null> {
    if (!env.REDIS_ENABLED) return null;

    const data = await redis.get(key);
    if (!data) return null;

    try {
      return JSON.parse(data) as T;
    } catch {
      return data as unknown as T;
    }
  },

  async del(key: string) {
    await redis.del(key);
  }
};

export const getKey = (provider: providers | string, ...args: any[]) => {
  return `${provider}:${args.join(':')}`;
};
