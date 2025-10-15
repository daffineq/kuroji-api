import 'reflect-metadata';
import { Hono } from 'hono';
import { createErrorResponse } from './helpers/response';
import { HttpError, NotFoundError } from './helpers/errors';
import { prettyJSON } from 'hono/pretty-json';
import env from './config/env';
import { cors } from 'hono/cors';
import rateLimit from './helpers/middlewares/rate.limit';
import animeRoute from './core/anime/anime.routes';
import proxy from './helpers/proxy';
import protectRoute from './helpers/middlewares/protect.route';
import apiRoute from './core/api/api.routes';

const app = new Hono().use(prettyJSON());

app.use(
  '/api/*',
  cors({
    origin: env.CORS,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: false
  })
);

app.use('/api/*', rateLimit(env.RATE_LIMIT, env.RATE_LIMIT_TTL));
app.use(
  '/api/*',
  protectRoute(() => {
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

app.get('api/proxy', async (c) => {
  const url = decodeURIComponent(c.req.query('url') ?? '');
  if (!url.startsWith('http')) return c.text('Invalid URL', 400);

  const referer = c.req.query('referer') ?? '';

  const customHeaders: Record<string, string> = {
    'User-Agent': c.req.header('user-agent') ?? '',
    Referer: referer
  };

  const { content, headers: proxyHeaders, isStream } = await proxy.fetchProxiedStream(url, customHeaders);

  for (const [key, value] of Object.entries(proxyHeaders)) {
    if (value) c.header(key, value);
  }

  if (isStream) {
    const stream = content as NodeJS.ReadableStream;
    const readable = new ReadableStream({
      start(controller) {
        stream.on('data', (chunk) => controller.enqueue(new Uint8Array(chunk)));
        stream.on('end', () => controller.close());
        stream.on('error', (err) => controller.error(err));
      }
    });
    return new Response(readable, { status: 200 });
  } else {
    const buffer = content as Buffer;
    return new Response(new Uint8Array(buffer), { status: 200 });
  }
});

Bun.serve({
  port: env.PORT,
  fetch: app.fetch,
  idleTimeout: 0
});

export default app;
