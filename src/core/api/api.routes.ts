import env from 'src/config/env';
import { UnauthorizedError } from 'src/helpers/errors';
import { ApiKeys } from './api.keys';
import { createSuccessResponse } from 'src/helpers/response';
import Elysia from 'elysia';

const apiRoute = () => {
  return (app: Elysia) =>
    app.group('/api', { tags: ['API'] }, (app) =>
      app
        .post('/api-key/generate', async ({ headers }) => {
          const adminKey = headers['x-api-key'];

          if (!adminKey) {
            throw new UnauthorizedError('Unauthorized');
          }

          const isValid =
            adminKey.length === env.ADMIN_KEY.length &&
            crypto.timingSafeEqual(Buffer.from(adminKey), Buffer.from(env.ADMIN_KEY));

          if (!isValid) {
            throw new UnauthorizedError('Unauthorized');
          }

          const apiKey = await ApiKeys.generate();

          return createSuccessResponse({
            message: 'Created api key',
            data: apiKey
          });
        })

        .get('/api-key', async ({ headers }) => {
          const apiKey = headers['x-api-key'];

          if (!apiKey) {
            throw new UnauthorizedError('Unauthorized');
          }

          const key = await ApiKeys.get(apiKey);

          return createSuccessResponse({
            message: 'Fetched api key',
            data: key
          });
        })
    );
};

export { apiRoute };
