import { createSuccessResponse } from 'src/helpers/response';
import { AnimeUpdate } from './anime.update';
import Elysia, { t } from 'elysia';
import logger from 'src/helpers/logger';
import { Anime } from '../anime';

const animeUpdateRoute = () => {
  return (app: Elysia) =>
    app.group('/anime/update', { tags: ['Anime Update'] }, (app) =>
      app
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

export { animeUpdateRoute };
