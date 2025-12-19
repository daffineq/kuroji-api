import 'reflect-metadata';
import { createErrorResponse, createSuccessResponse } from './helpers/response';
import { HttpError } from './helpers/errors';
import env from './config/env';
import rateLimit from './helpers/plugins/rate.limit';
import protectRoute from './helpers/plugins/protect.route';
import { animeRoute, apiRoute, proxyRoute, yoga } from './core';
import logger from './helpers/logger';
import { HTTPError } from 'ky';
import Elysia, { NotFoundError } from 'elysia';
import { cors } from '@elysiajs/cors';
import swagger from '@elysiajs/swagger';

const app = new Elysia()
  .use(
    cors({
      origin: env.CORS,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: false
    })
  )
  .use(
    protectRoute((request) =>
      ['/docs', '/docs/openapi'].includes(new URL(request.url).pathname)
        ? true
        : env.API_STRATEGY === 'not_required'
    )
  )
  .use(
    rateLimit(env.RATE_LIMIT, env.RATE_LIMIT_TTL, (request) =>
      ['/docs', '/docs/openapi'].includes(new URL(request.url).pathname)
    )
  )
  .use(
    swagger({
      path: '/docs',
      specPath: '/docs/openapi',
      documentation: {
        info: {
          title: 'Kuroji API',
          description: 'Public documentation for the Kuroji API.',
          version: '1.0.0'
        },
        servers: [
          {
            url: env.PUBLIC_URL,
            description: 'Production server'
          }
        ],
        components: {
          securitySchemes: {
            apiKey: {
              type: 'apiKey',
              in: 'header',
              name: 'x-api-key',
              description: 'API key'
            }
          }
        },
        security: [{ apiKey: [] }],
        tags: [
          {
            name: 'Anime',
            description: 'Anime REST endpoints'
          },
          {
            name: 'API',
            description: 'Main REST endpoints'
          },
          {
            name: 'Proxy',
            description: 'Proxy endpoints'
          },
          {
            name: 'GraphQL',
            description: 'GraphQL endpoints'
          }
        ]
      }
    })
  )
  .onError(({ error, set }) => {
    if (error instanceof NotFoundError) {
      set.status = 404;
      return createErrorResponse({
        error: { status: 404, message: 'Route not found', details: `Docs: ${env.PUBLIC_URL}/docs` }
      });
    }

    if (error instanceof HttpError) {
      set.status = error.status;
      return createErrorResponse({
        error: { status: error.status, message: error.message, details: error.details }
      });
    }

    if (error instanceof HTTPError) {
      set.status = error.response?.status ?? 500;
      return createErrorResponse({
        error: {
          status: set.status,
          message: error.message
        }
      });
    }

    if (error instanceof Error) {
      set.status = 500;
      return createErrorResponse({
        error: { status: 500, message: error.message, details: error.stack }
      });
    }

    set.status = 500;
    return createErrorResponse({ error: { status: 500, message: 'Unknown error' } });
  });

app.use(animeRoute());
app.use(apiRoute());
app.use(proxyRoute());

app.get('/graphql', ({ request }) => yoga.handle(request));
app.post('/graphql', ({ request }) => yoga.handle(request));

app.get('/logs', ({ query }) => {
  const page = Math.max(1, Number(query.page ?? 1));
  const perPage = Math.min(100, Math.max(1, Number(query.per_page ?? 50)));

  const logs = logger.getLogsPaginated(page, perPage);

  return createSuccessResponse({ message: 'Logs got', data: logs });
});

export default app;
