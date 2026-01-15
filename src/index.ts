import 'reflect-metadata';
import './helpers/self.poll';

import { createErrorResponse, createSuccessResponse } from './helpers/response';
import { HttpError } from './helpers/errors';
import { Config } from './config/config';
import rateLimit from './helpers/plugins/rate.limit';
import protectRoute from './helpers/plugins/protect.route';
import { animeRoute, apiRoute, proxyRoute, yoga } from './core';
import logger from './helpers/logger';
import { HTTPError } from 'ky';
import Elysia, { NotFoundError, t } from 'elysia';
import { cors } from '@elysiajs/cors';
import swagger from '@elysiajs/swagger';
import { db } from './db';
import { sql } from 'drizzle-orm';

const app = new Elysia()
  .use(
    cors({
      origin: Config.cors,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: false
    })
  )
  .use(
    protectRoute((request) => {
      const path = new URL(request.url).pathname;

      if (Config.routes_whitelist.includes(path)) return true;
      if (Config.routes_blacklist.includes(path)) return false;

      return Config.api_strategy === 'not_required';
    })
  )
  .use(
    rateLimit(Config.rate_limit, Config.rate_limit_ttl, (request) => {
      const path = new URL(request.url).pathname;

      if (Config.routes_whitelist.includes(path)) return true;
      if (Config.routes_blacklist.includes(path)) return false;

      return true;
    })
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
            url: Config.public_url,
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
            name: 'System',
            description: 'System endpoints'
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
        error: { status: 404, message: 'Route not found', details: `Docs: ${Config.public_url}/docs` }
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

app.get('/graphql', ({ request }) => yoga.handle(request), {
  tags: ['GraphQL'],
  detail: {
    summary: 'GraphQL Playground',
    description: 'GraphiQL UI for graphql'
  }
});

app.post('/graphql', ({ request }) => yoga.handle(request), {
  tags: ['GraphQL'],
  detail: {
    summary: 'GraphQL',
    description: 'The graphql'
  }
});

app.get(
  '/logs',
  ({ query }) => {
    const logs = logger.getLogsPaginated(query.page, query.per_page);

    return createSuccessResponse({ message: 'Logs got', data: logs });
  },
  {
    tags: ['System'],
    query: t.Object({
      page: t.Optional(t.Number({ default: 1 })),
      per_page: t.Optional(t.Number({ default: 50, maximum: 100 }))
    }),
    detail: {
      summary: 'Logs',
      description: 'Returns logs from logger'
    }
  }
);

app.get(
  '/state',
  async () => {
    const uptime = (): string => {
      const uptime = process.uptime();
      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);

      return `${hours}h ${minutes}m ${seconds}s`;
    };

    const size = (await db.execute(sql`SELECT pg_size_pretty(pg_database_size(current_database())) AS size;`)) as {
      size: string;
    }[];

    const memory = process.memoryUsage();

    const dbHealthy = await db.execute(sql`SELECT 1`);

    return createSuccessResponse({
      message: 'State of API',
      data: {
        uptime: uptime(),
        db: {
          size: size[0]?.size,
          healthy: dbHealthy ? true : false
        },
        memory: {
          rss: `${(memory.rss / 1024 / 1024).toFixed(2)} MB`,
          heap_total: `${(memory.heapTotal / 1024 / 1024).toFixed(2)} MB`,
          heap_used: `${(memory.heapUsed / 1024 / 1024).toFixed(2)} MB`,
          external: `${(memory.external / 1024 / 1024).toFixed(2)} MB`
        }
      }
    });
  },
  {
    tags: ['System'],
    detail: {
      summary: 'State',
      description: 'Returns system state'
    }
  }
);

export default app;
