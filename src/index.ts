import 'reflect-metadata';
import { Hono } from 'hono';
import { createErrorResponse, createSuccessResponse } from './helpers/response';
import { HttpError, NotFoundError } from './helpers/errors';
import { prettyJSON } from 'hono/pretty-json';
import env from './config/env';
import { cors } from 'hono/cors';
import rateLimit from './helpers/middlewares/rate.limit';
import protectRoute from './helpers/middlewares/protect.route';
import { describeRoute, openAPIRouteHandler } from 'hono-openapi';
import { Scalar } from '@scalar/hono-api-reference';
import { animeRoute, apiRoute, proxyRoute, yoga } from './core';
import logger from './helpers/logger';

const app = new Hono().use(prettyJSON());

app.use(
  '*',
  cors({
    origin: env.CORS,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: false
  })
);

app.use('*', rateLimit(env.RATE_LIMIT, env.RATE_LIMIT_TTL));
app.use(
  '*',
  protectRoute((c) => {
    if (['/docs', '/docs/openapi'].includes(c.req.path)) {
      return true;
    }

    return env.API_STRATEGY === 'not_required';
  })
);

app.onError((err, c) => {
  if (err instanceof HttpError) {
    return c.json(
      createErrorResponse({
        error: {
          status: err.status,
          message: err.message,
          details: err.details
        }
      }),
      err.status
    );
  }

  if (err instanceof Error) {
    return c.json(
      createErrorResponse({
        error: {
          status: 500,
          message: err.message,
          details: err.stack
        }
      }),
      500
    );
  }

  return c.json(
    createErrorResponse({
      error: {
        status: 500,
        message: 'Unknown error'
      }
    }),
    500
  );
});

app.notFound((c) => {
  throw new NotFoundError('Page not found', `Docs: ${env.PUBLIC_URL}/docs`);
});

app.route('/api', animeRoute);
app.route('/api', apiRoute);
app.route('/proxy', proxyRoute);

app.get(
  '/docs/openapi',
  describeRoute({
    tags: ['Docs'],
    description: 'Returns the full OpenAPI schema for the Kuroji API.',
    responses: {
      200: {
        description: 'OpenAPI JSON documentation.'
      }
    }
  }),
  openAPIRouteHandler(app, {
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
          name: 'Docs',
          description: 'Documentation-related endpoints'
        },
        {
          name: 'GraphQL',
          description: 'GraphQL endpoints'
        }
      ]
    }
  })
);

app.get(
  '/docs',
  describeRoute({
    tags: ['Docs'],
    description: 'Interactive Swagger-like UI rendered with Scalar.'
  }),
  Scalar({
    theme: 'saturn',
    url: '/docs/openapi'
  })
);

app.get(
  '/graphql',
  describeRoute({
    tags: ['GraphQL'],
    description: 'GraphQL Playground (GraphiQL UI). Use this to explore and test queries.'
  }),
  (c) => yoga.handle(c.req.raw)
);

app.post(
  '/graphql',
  describeRoute({
    tags: ['GraphQL'],
    description: 'Main GraphQL endpoint. Send GraphQL operations here.',
    responses: {
      200: {
        description: 'GraphQL response payload.'
      }
    }
  }),
  (c) => yoga.handle(c.req.raw)
);

app.get(
  '/logs',
  describeRoute({
    tags: ['API'],
    description: 'Get logs',
    responses: {
      200: {
        description: 'Logs'
      }
    }
  }),
  (c) => {
    return c.json(
      createSuccessResponse({
        message: 'Logs got',
        data: logger.getLogs()
      })
    );
  }
);

export default app;
