import Elysia, { t } from 'elysia';
import proxy from 'src/helpers/proxy';
import { createMessageResponse } from 'src/helpers/response';

const proxyRoute = () => {
  return (app: Elysia) =>
    app.group('/proxy', { tags: ['Proxy'] }, (app) =>
      app.get(
        '',
        async ({ query, headers, set }) => {
          const url = decodeURIComponent(query.url ?? '');
          if (!url.startsWith('http')) return createMessageResponse({ message: 'Invalid url' });

          const referer = query.referer ?? '';

          const customHeaders: Record<string, string> = {
            'User-Agent': headers['user-agent'] ?? '',
            Referer: referer
          };

          const { content, headers: proxyHeaders, isStream } = await proxy.fetchProxiedStream(url, customHeaders);

          for (const [key, value] of Object.entries(proxyHeaders)) {
            if (value) set.headers[key] = value;
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
        },
        {
          query: t.Object({ url: t.String(), referer: t.String() }),
          detail: {
            description: 'A proxy for streaming sources, i honestly dont even know if it works at all, but anyways'
          }
        }
      )
    );
};

export { proxyRoute };
