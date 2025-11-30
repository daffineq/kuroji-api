import redis from 'src/lib/redis';
import { ForbiddenError, RateLimitExceededError } from '../errors';
import { Context, Next } from 'hono';
import apiKeys from 'src/core/api/api.keys';
import env from 'src/config/env';

const rateLimit = (limit: number, windowSec: number) => {
  return async (c: Context, next: Next) => {
    const apiKey = c.req.header('x-api-key');

    if (apiKey) {
      if (await apiKeys.validate(apiKey)) {
        await apiKeys.used(apiKey, c);
        return await next();
      }

      if (
        apiKey.length === env.ADMIN_KEY.length &&
        crypto.timingSafeEqual(Buffer.from(apiKey), Buffer.from(env.ADMIN_KEY))
      ) {
        return await next();
      }
    }

    const ip =
      c.req.header('cf-connecting-ip') ??
      c.req.header('x-forwarded-for') ??
      c.req.header('x-real-ip') ??
      '127.0.0.1';

    if (!ip) {
      throw new ForbiddenError('IP address not found');
    }

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
      return await next();
    }

    if (count > limit) {
      throw new RateLimitExceededError(
        'Rate Limit Exceeded',
        'Look in the headers `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset`'
      );
    }

    return await next();
  };
};

export default rateLimit;
