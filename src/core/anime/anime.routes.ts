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
            query: t.Object({
              delay: t.Optional(t.Number({ default: 5 })),
              status: t.Optional(t.String({ description: 'Anime status from anilist' }))
            }),
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
              description: 'Process items in update queue'
            }
          }
        )

        .put(
          '/update/recent',
          () => {
            AnimeUpdate.queueRecentAnime().catch((error) => {
              logger.error('Error queuing:', error);
            });

            return createSuccessResponse({ message: 'Queuing' });
          },
          {
            detail: {
              summary: 'Update Recent',
              description: 'Updates recent aired anime (2 hours +-)'
            }
          }
        )

        .put(
          '/update/today',
          () => {
            AnimeUpdate.queueTodayAnime().catch((error) => {
              logger.error('Error queuing:', error);
            });

            return createSuccessResponse({ message: 'Queuing' });
          },
          {
            detail: {
              summary: 'Update Today',
              description: 'Updates today aired anime'
            }
          }
        )

        .put(
          '/update/two-days-ago',
          () => {
            AnimeUpdate.queueTwoDaysAgoAnime().catch((error) => {
              logger.error('Error queuing:', error);
            });

            return createSuccessResponse({ message: 'Queuing' });
          },
          {
            detail: {
              summary: 'Update Two Days Ago',
              description: 'Updates 2 days ago aired anime'
            }
          }
        )

        .delete(
          '/update/queue/clear',
          async () => {
            await AnimeUpdate.clearQueue();

            return createSuccessResponse({ message: 'Cleared the queue' });
          },
          {
            query: t.Object({ id: t.Number() }),
            detail: {
              summary: 'Clear Queue',
              description: 'Clears the anime update queue'
            }
          }
        )
    );
};

export { animeRoute };
