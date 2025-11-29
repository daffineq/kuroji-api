import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { describeRoute } from 'hono-openapi';
import { describeTags } from 'src/helpers/docs';
import proxy from 'src/helpers/proxy';
import { z } from 'zod';

const proxyRoute = new Hono().use('*', describeTags(['Proxy']));

export const proxyQuerySchema = z.object({
  url: z.url().describe('URL to proxy'),
  referer: z.string().optional()
});

proxyRoute.get(
  '',
  zValidator('query', proxyQuerySchema),
  describeRoute({
    description: 'Fetches remote content and returns it through your API.',
    responses: {
      200: { description: 'Proxied content stream or buffer.' },
      400: { description: 'Invalid query.' }
    }
  }),
  async (c) => {
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
  }
);

export default proxyRoute;
