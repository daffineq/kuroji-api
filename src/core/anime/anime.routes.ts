import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { describeRoute } from 'hono-openapi';
import { parseNumber } from 'src/helpers/parsers';
import { createSuccessResponse } from 'src/helpers/response';
import animeIndexer from './helpers/anime.indexer';
import animeUpdate from './helpers/anime.update';
import logger from 'src/helpers/logger';
import { describeTags } from 'src/helpers/docs';
import anime from './anime';
import { Prisma } from '@prisma/client';

const animeRoute = new Hono().basePath('/anime').use('*', describeTags(['Anime']));

const startIndexerQuerySchema = z.object({
  delay: z.coerce.number().optional().describe('Optional delay in seconds before starting the indexer')
});

animeRoute.get(
  '/fetchOrCreate/:id',
  describeRoute({
    description: 'Fetches an anime by ID. If it does not exist yet, it will be initialized.',
    responses: {
      200: { description: 'Anime fetched or created successfully.' },
      400: { description: 'Invalid parameters or malformed body.' }
    }
  }),
  async (c) => {
    const { id } = c.req.param();

    return c.json(
      createSuccessResponse({
        data: await anime.fetchOrCreate(parseNumber(id)!),
        message: 'Fetched info'
      })
    );
  }
);

animeRoute.post(
  '/indexer/start',
  zValidator('query', startIndexerQuerySchema),
  describeRoute({
    description:
      'Starts the anime indexer. Optionally accepts a `delay` query param (in seconds), the delay between each request, default is 10',
    responses: {
      200: { description: 'Indexer started successfully.' },
      400: { description: 'Invalid query parameters.' }
    }
  }),
  async (c) => {
    const { delay } = c.req.valid('query') as { delay?: number };

    const start = await animeIndexer.start(delay);

    return c.json(
      createSuccessResponse({
        message: start
      })
    );
  }
);

animeRoute.post(
  '/indexer/stop',
  describeRoute({
    description: 'Stops the anime indexer immediately.',
    responses: {
      200: { description: 'Indexer stopped.' }
    }
  }),
  async (c) => {
    animeIndexer.stop();

    return c.json(
      createSuccessResponse({
        message: 'Stopped indexer'
      })
    );
  }
);

animeRoute.put(
  '/update/process',
  describeRoute({
    description:
      'Processes the update queue for anime metadata changes. This triggers background processing; it returns immediately.',
    responses: {
      200: { description: 'Update queue processing started.' }
    }
  }),
  async (c) => {
    animeUpdate.processQueue().catch((error) => {
      logger.error('Error processing update queue:', error);
    });

    return c.json(
      createSuccessResponse({
        message: 'Processing update queue'
      })
    );
  }
);

export default animeRoute;
