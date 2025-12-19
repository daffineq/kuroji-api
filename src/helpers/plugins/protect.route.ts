import { UnauthorizedError } from '../errors';
import env from 'src/config/env';
import { ApiKeys } from 'src/core';
import Elysia from 'elysia';

const protectRoute = (skip: (request: Request) => boolean) => {
  return (app: Elysia) =>
    app.onBeforeHandle(async ({ request }) => {
      if (skip(request)) return;

      const apiKey = request.headers.get('x-api-key');
      if (!apiKey) throw new UnauthorizedError('Api key required');

      if (await ApiKeys.validate(apiKey)) return;

      if (
        apiKey.length === env.ADMIN_KEY.length &&
        crypto.timingSafeEqual(Buffer.from(apiKey), Buffer.from(env.ADMIN_KEY))
      ) {
        return;
      }

      throw new UnauthorizedError('Invalid api key');
    });
};

export default protectRoute;
