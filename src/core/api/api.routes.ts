import { Hono } from 'hono';
import env from 'src/config/env';
import { UnauthorizedError } from 'src/helpers/errors';
import apiKeys from './api.keys';
import { createSuccessResponse } from 'src/helpers/response';
import { parseJson } from 'src/helpers/parsers';
import { Prisma } from '@prisma/client';
import { describeTags } from 'src/helpers/docs';
import { describeRoute } from 'hono-openapi';

const apiRoute = new Hono().use('*', describeTags(['API']));

apiRoute.post(
  '/api-key/generate',
  describeRoute({
    description: 'Creates a new API key. Requires the admin key in the `x-api-key` header for authorization.',
    responses: {
      200: {
        description: 'Newly created API key.'
      },
      401: {
        description: 'Unauthorized — wrong or missing admin key.'
      }
    }
  }),
  async (c) => {
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
  }
);

apiRoute.post(
  '/api-key',
  describeRoute({
    description:
      'Retrieves information about an API key using Prisma-style arguments. Requires the API key in the `x-api-key` header.',
    requestBody: {
      description: 'Prisma ApiKeyDefaultArgs JSON structure.',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            description: 'Raw Prisma args passed to the database.'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Fetched API key info.'
      },
      401: {
        description: 'Unauthorized — invalid or missing API key.'
      }
    }
  }),
  async (c) => {
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
  }
);

export default apiRoute;
