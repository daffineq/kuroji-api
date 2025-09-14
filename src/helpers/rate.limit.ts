import redis from 'src/lib/redis';
import { RateLimitExceededError } from './errors';

const rateLimit = (limit: number, windowSec: number) => {
  return async (c, next) => {
    const ip = c.req.header('x-forwarded-for') || c.req.raw.headers.get('cf-connecting-ip') || 'unknown';

    const key = `ratelimit:${ip}`;
    const ttlKey = `${key}:ttl`;

    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, windowSec);
      await redis.set(ttlKey, Date.now() + windowSec * 1000, 'EX', windowSec);
    }

    const ttlMs = await redis.get(ttlKey);
    const reset = ttlMs ? Number(ttlMs) : Date.now() + windowSec * 1000;
    const remaining = Math.max(0, limit - count);

    c.res.headers.set('X-RateLimit-Limit', limit.toString());
    c.res.headers.set('X-RateLimit-Remaining', remaining.toString());
    c.res.headers.set('X-RateLimit-Reset', Math.floor(reset / 1000).toString());

    if (limit === 0) {
      await next();
      return;
    }

    if (count > limit) {
      throw new RateLimitExceededError(
        'Rate Limit Exceeded',
        'Look in the headers `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset`'
      );
    }

    await next();
  };
};

export default rateLimit;
