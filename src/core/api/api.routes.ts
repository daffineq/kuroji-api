import { Hono } from 'hono';
import env from 'src/config/env';
import { UnauthorizedError } from 'src/helpers/errors';
import apiKeys from './api.keys';
import { createSuccessResponse } from 'src/helpers/response';
import { parseJson } from 'src/helpers/parsers';
import { Prisma } from '@prisma/client';

const apiRoute = new Hono();

apiRoute.post('/api-key/generate', async (c) => {
  const adminKey = c.req.header('x-api-key');

  if (!adminKey) {
    throw new UnauthorizedError('Unauthorized');
  }

  const isValid =
    adminKey.length === env.ADMIN_KEY.length &&
    crypto.timingSafeEqual(Buffer.from(adminKey), Buffer.from(env.ADMIN_KEY));

  if (!isValid) {
    throw new UnauthorizedError('Unauthorized');
  }

  const apiKey = await apiKeys.generate();

  return c.json(
    createSuccessResponse({
      message: 'Created api key',
      data: apiKey
    })
  );
});

apiRoute.post('/api-key', async (c) => {
  const apiKey = c.req.header('x-api-key');

  if (!apiKey) {
    throw new UnauthorizedError('Unauthorized');
  }

  const json = await parseJson(c.req);

  const key = await apiKeys.get(apiKey, json as Prisma.ApiKeyDefaultArgs);

  return c.json(
    createSuccessResponse({
      message: 'Fetched api key',
      data: key
    })
  );
});

export default apiRoute;
