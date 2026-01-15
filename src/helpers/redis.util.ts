import { Config } from 'src/config/config';
import redis from 'src/lib/redis';
import { providers } from 'src/core/anime/types';
import { localStore } from './local.store';

class RedisModule {
  async set(key: string, value: any, ttlSeconds: number = Config.redis_ttl) {
    if (Config.caching_enabled) return;

    const data = typeof value === 'string' ? value : JSON.stringify(value);

    if (redis) {
      if (ttlSeconds) {
        await redis.set(key, data, 'EX', ttlSeconds);
      } else {
        await redis.set(key, data);
      }
      return;
    }

    await localStore.set(key, data, ttlSeconds);
  }

  async get<T = any>(key: string): Promise<T | null> {
    if (Config.caching_enabled) return null;

    let data: string | null = null;

    if (redis) {
      data = await redis.get(key);
    } else {
      data = await localStore.get(key);
    }

    if (!data) return null;

    try {
      return JSON.parse(data) as T;
    } catch {
      return data as unknown as T;
    }
  }

  async del(key: string) {
    if (Config.caching_enabled) return;

    if (redis) {
      await redis.del(key);
    } else {
      await localStore.del(key);
    }
  }

  async incr(key: string) {
    if (Config.caching_enabled) return;

    if (redis) {
      return await redis.incr(key);
    } else {
      return await localStore.incr(key);
    }
  }

  async expire(key: string, ttlSeconds: number) {
    if (Config.caching_enabled) return;

    if (redis) {
      return await redis.expire(key, ttlSeconds);
    } else {
      return await localStore.expire(key, ttlSeconds);
    }
  }

  async ttl(key: string) {
    if (Config.caching_enabled) return;

    if (redis) {
      return await redis.ttl(key);
    } else {
      return await localStore.ttl(key);
    }
  }
}

export const getKey = (provider: providers | string, ...args: any[]) => {
  return `${provider.toLowerCase()}:${args.join(':')}`;
};

export const Redis = new RedisModule();
