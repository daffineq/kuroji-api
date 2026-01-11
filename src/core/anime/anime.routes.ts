import { createSuccessResponse } from 'src/helpers/response';
import { AnimeIndexer } from './helpers/anime.indexer';
import { AnimeUpdate } from './helpers/anime.update';
import logger from 'src/helpers/logger';
import Elysia, { t } from 'elysia';
import { Anime } from './anime';

const animeRoute = () => {
  return (app: Elysia) =>
    app.group('/api/anime', { tags: ['Anime'] }, (app) =>
      app
        .post(
          '/indexer/start',
          async ({ query }) =>
            createSuccessResponse({
              message: await AnimeIndexer.start(query.delay)
            }),
          {
            query: t.Object({ delay: t.Optional(t.Number({ default: 5 })) }),
            detail: {
              summary: 'Start Indexer',
              description: 'Starts indexing animes'
            }
          }
        )

        .post('/indexer/stop', () => createSuccessResponse({ message: AnimeIndexer.stop() }), {
          detail: {
            summary: 'Stop Indexer',
            description: 'Stops indexing'
          }
        })

        .post('/indexer/reset', () => createSuccessResponse({ message: AnimeIndexer.reset() }), {
          detail: {
            summary: 'Reset Indexer',
            description: 'Resets the state of indexer, it will start from page 1 on next start'
          }
        })

        .put(
          '/update',
          ({ query }) => {
            Anime.update(query.id).catch((error) => {
              logger.error('Error updating:', error);
            });

            return createSuccessResponse({ message: 'Updating anime' });
          },
          {
            query: t.Object({ id: t.Number() }),
            detail: {
              summary: 'Update Anime',
              description: 'Updates anime with queried id'
            }
          }
        )

        .put(
          '/update/process',
          () => {
            AnimeUpdate.processQueue().catch((error) => {
              logger.error('Error processing update queue:', error);
            });

            return createSuccessResponse({ message: 'Processing update queue' });
          },
          {
            detail: {
              summary: 'Process Update',
              description:
                'Not really necessary, just a way to manually process the update queue, scheduler does it as well'
            }
          }
        )
    );
};

export { animeRoute };
