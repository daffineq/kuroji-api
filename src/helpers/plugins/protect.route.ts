import { UnauthorizedError } from '../errors';
import { Config } from 'src/config/config';
import { ApiKeys } from 'src/core';
import Elysia from 'elysia';
import { getApiKey } from '../utils';

const protectRoute = (skip: (request: Request) => boolean) => {
  return (app: Elysia) =>
    app.onBeforeHandle(async ({ request }) => {
      if (skip(request)) return;

      const apiKey = getApiKey(request);
      if (!apiKey) throw new UnauthorizedError('Api key required');

      if (await ApiKeys.validate(apiKey)) return;

      if (
        apiKey.length === Config.admin_key.length &&
        crypto.timingSafeEqual(Buffer.from(apiKey), Buffer.from(Config.admin_key))
      ) {
        return;
      }

      throw new UnauthorizedError('Invalid api key');
    });
};

export default protectRoute;
