import env from 'src/config/env';
import { UnauthorizedError } from 'src/helpers/errors';
import { ApiKeys } from './api.keys';
import { createSuccessResponse } from 'src/helpers/response';
import Elysia, { t } from 'elysia';

const apiRoute = () => {
  return (app: Elysia) =>
    app.group('/api', { tags: ['API'] }, (app) =>
      app
        .post(
          '/api-key/generate',
          async ({ request }) => {
            const adminKey = request.headers.get('x-api-key');

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
          },
          {
            detail: {
              description: 'Generates a new api key, requires admin key from .env in x-api-key header'
            },
            headers: t.Object({
              'x-api-key': t.String()
            })
          }
        )

        .get(
          '/api-key',
          async ({ request }) => {
            const apiKey = request.headers.get('x-api-key');

            if (!apiKey) {
              throw new UnauthorizedError('Unauthorized');
            }

            const key = await ApiKeys.get(apiKey);

            return createSuccessResponse({
              message: 'Fetched api key',
              data: key
            });
          },
          {
            detail: {
              description: 'Returns details about api key passed in x-api-key header'
            },
            headers: t.Object({
              'x-api-key': t.String()
            })
          }
        )
    );
};

export { apiRoute };
