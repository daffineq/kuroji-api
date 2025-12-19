import { parseNumber } from 'src/helpers/parsers';
import { createSuccessResponse } from 'src/helpers/response';
import { AnimeIndexer } from './helpers/anime.indexer';
import { AnimeUpdate } from './helpers/anime.update';
import logger from 'src/helpers/logger';
import { Anime } from './anime';
import Elysia, { t } from 'elysia';

const animeRoute = () => {
  return (app: Elysia) =>
    app.group('/api/anime', { tags: ['Anime'] }, (app) =>
      app
        .get(
          '/fetchOrCreate/:id',
          async ({ params }) =>
            createSuccessResponse({
              data: await Anime.fetchOrCreate(parseNumber(params.id)!),
              message: 'Fetched info'
            }),
          {
            params: t.Object({ id: t.Number() })
          }
        )

        .post(
          '/indexer/start',
          async ({ query }) =>
            createSuccessResponse({
              message: await AnimeIndexer.start(parseNumber(query.delay))
            }),
          {
            query: t.Object({ delay: t.Number() })
          }
        )

        .post('/indexer/stop', () => {
          AnimeIndexer.stop();
          return createSuccessResponse({ message: 'Stopped indexer' });
        })

        .post('/indexer/reset', () => {
          AnimeIndexer.setLastFetchedPage(1);
          return createSuccessResponse({ message: 'Reseted indexer' });
        })

        .put('/update/process', () => {
          AnimeUpdate.processQueue().catch((error) => {
            logger.error('Error processing update queue:', error);
          });

          return createSuccessResponse({ message: 'Processing update queue' });
        })
    );
};

export { animeRoute };
