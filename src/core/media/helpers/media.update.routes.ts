import { createSuccessResponse } from 'src/helpers/response';
import Elysia, { t } from 'elysia';
import logger from 'src/helpers/logger';
import { Anime } from 'src/core';
import { MediaUpdate } from './media.update';

const mediaUpdateRoute = () => {
  return (app: Elysia) =>
    app.group('/media/update', { tags: ['Media Update'] }, (app) =>
      app
        .put(
          '/update',
          ({ query }) => {
            Anime.update(query.id).catch((error) => {
              logger.error('Error updating:', error);
            });

            return createSuccessResponse({ message: 'Updating media' });
          },
          {
            query: t.Object({ id: t.Number() }),
            detail: {
              summary: 'Update Media',
              description: 'Updates media with queried id'
            }
          }
        )

        .put(
          '/update/process',
          () => {
            MediaUpdate.processQueue().catch((error) => {
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
          '/update/today',
          () => {
            MediaUpdate.queueTodayAnime().catch((error) => {
              logger.error('Error queuing:', error);
            });

            return createSuccessResponse({ message: 'Queuing' });
          },
          {
            detail: {
              summary: 'Update Today',
              description: 'Updates today aired media'
            }
          }
        )

        .put(
          '/update/yesterday',
          () => {
            MediaUpdate.queueYesterdayAnime().catch((error) => {
              logger.error('Error queuing:', error);
            });

            return createSuccessResponse({ message: 'Queuing' });
          },
          {
            detail: {
              summary: 'Update Yesterday',
              description: 'Updates yesterday aired media'
            }
          }
        )

        .delete(
          '/update/queue/clear',
          async () => {
            await MediaUpdate.clearQueue();

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

export { mediaUpdateRoute };
