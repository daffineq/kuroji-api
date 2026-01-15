import { ForbiddenError, RateLimitExceededError } from '../errors';
import { Config } from 'src/config/config';
import { ApiKeys } from 'src/core';
import Elysia from 'elysia';
import { Redis } from '../redis.util';

const rateLimit = (limit: number, windowSec: number, skip: (request: Request) => boolean) => {
  return (app: Elysia) =>
    app.onBeforeHandle(async ({ request, set }) => {
      if (skip(request)) return;

      const apiKey = request.headers.get('x-api-key');

      if (apiKey) {
        if (await ApiKeys.validate(apiKey)) return;

        if (
          apiKey.length === Config.admin_key.length &&
          crypto.timingSafeEqual(Buffer.from(apiKey), Buffer.from(Config.admin_key))
        )
          return;
      }

      const ip =
        request.headers.get('cf-connecting-ip') ??
        request.headers.get('x-forwarded-for') ??
        request.headers.get('x-real-ip') ??
        '127.0.0.1';

      if (!ip) throw new ForbiddenError('IP address not found');

      const key = `ratelimit:${ip}`;
      const ttlKey = `${key}:ttl`;

      const count = await Redis.incr(key);
      if (count === 1) {
        await Redis.expire(key, windowSec);
        await Redis.set(ttlKey, Date.now() + windowSec * 1000, windowSec);
      }

      const ttlMs = await Redis.get(ttlKey);
      const reset = ttlMs ? Number(ttlMs) : Date.now() + windowSec * 1000;
      const remaining = Math.max(0, limit - count);

      set.headers['X-RateLimit-Limit'] = limit.toString();
      set.headers['X-RateLimit-Remaining'] = remaining.toString();
      set.headers['X-RateLimit-Reset'] = Math.floor(reset / 1000).toString();

      if (limit !== 0 && count > limit) {
        throw new RateLimitExceededError('Rate Limit Exceeded');
      }
    });
};

export default rateLimit;
