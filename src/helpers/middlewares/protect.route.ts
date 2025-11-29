import { Context, Next } from 'hono';
import { UnauthorizedError } from '../errors';
import apiKeys from 'src/core/api/api.keys';
import env from 'src/config/env';

const protectRoute = (skip: (c: Context) => boolean) => {
  return async (c: Context, next: Next) => {
    if (skip(c)) {
      return await next();
    }

    const apiKey = c.req.header('x-api-key');

    if (!apiKey) {
      throw new UnauthorizedError('No api key provided');
    }

    if (await apiKeys.validate(apiKey)) {
      return await next();
    }

    if (
      apiKey.length === env.ADMIN_KEY.length &&
      crypto.timingSafeEqual(Buffer.from(apiKey), Buffer.from(env.ADMIN_KEY))
    ) {
      return await next();
    }

    throw new UnauthorizedError('Invalid api key');
  };
};

export default protectRoute;
