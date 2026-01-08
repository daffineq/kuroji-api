import { Config } from 'src/config/config';
import { providers } from 'src/core/anime/types';
import redis from 'src/lib/redis';

export const Redis = {
  async set(key: string, value: any, ttlSeconds: number = Config.redis_ttl) {
    if (!Config.redis_enabled) return;

    const data = typeof value === 'string' ? value : JSON.stringify(value);
    if (ttlSeconds) {
      await redis.set(key, data, 'EX', ttlSeconds);
    } else {
      await redis.set(key, data);
    }
  },

  async get<T = any>(key: string): Promise<T | null> {
    if (!Config.redis_enabled) return null;

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
  return `${provider.toLowerCase()}:${args.join(':')}`;
};
