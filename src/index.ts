import { Hono } from 'hono';
import { createErrorResponse, createSuccessResponse } from './helpers/response';
import { HttpError, NotFoundError } from './helpers/errors';
import { prettyJSON } from 'hono/pretty-json';
import env from './config/env';
import { cors } from 'hono/cors';
import rateLimit from './helpers/rate.limit';
import animeRoute from './core/anime/anime.routes';

const app = new Hono().use(prettyJSON());

const api = new Hono();

api.route('/anime', animeRoute);

app.use(
  '/api',
  cors({
    origin: env.CORS,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: false
  })
);

app.use('/api', rateLimit(env.RATE_LIMIT, env.RATE_LIMIT_TTL));

app.onError((err, c) => {
  if (err instanceof HttpError) {
    return c.json(createErrorResponse(err.status, err.message, err.details), err.status);
  }

  if (err instanceof Error) {
    console.log(err.stack);
    return c.json(createErrorResponse(500, err.message, err.stack), 500);
  }

  return c.json(createErrorResponse(500, 'Unknown error'), 500);
});

app.notFound((c) => {
  throw new NotFoundError('Page not found', `Docs: ${env.PUBLIC_URL}/docs`);
});

app.get('/', (c) => {
  return c.json(createSuccessResponse({}, 'Hello, world!'), 200);
});

app.route('/api', api);

Bun.serve({
  port: env.PORT,
  fetch: app.fetch,
  idleTimeout: 0
});

export default app;
