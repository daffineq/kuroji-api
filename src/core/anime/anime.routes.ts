import { createSuccessResponse } from 'src/helpers/response';
import { AnimeIndexer } from './helpers/anime.indexer';
import { AnimeUpdate } from './helpers/anime.update';
import logger from 'src/helpers/logger';
import Elysia, { t } from 'elysia';
import { Prisma, prisma } from 'src/lib/prisma';
import { Anime } from './anime';

const animeRoute = () => {
  return (app: Elysia) =>
    app.group('/api/anime', { tags: ['Anime'] }, (app) =>
      app
        .get(
          '/update/history',
          async ({ query }) => {
            const skip = (query.page ?? 1 - 1) * (query.per_page ?? 50);

            let where: Prisma.UpdateHistoryWhereInput = {};

            if (query.anime_id) {
              where.anime_id = query.anime_id;
            }

            return prisma.updateHistory.findMany({
              where,
              skip,
              take: query.per_page ?? 50
            });
          },
          {
            query: t.Object({
              page: t.Optional(t.Number({ default: 1 })),
              per_page: t.Optional(t.Number({ default: 50, maximum: 100 })),
              anime_id: t.Optional(t.Number())
            }),
            detail: {
              description: 'Returns history of updates'
            }
          }
        )

        .post(
          '/indexer/start',
          async ({ query }) =>
            createSuccessResponse({
              message: await AnimeIndexer.start(query.delay)
            }),
          {
            query: t.Object({ delay: t.Optional(t.Number({ default: 5 })) }),
            detail: {
              description: 'Starts indexing animes'
            }
          }
        )

        .post('/indexer/stop', () => createSuccessResponse({ message: AnimeIndexer.stop() }), {
          detail: {
            description: 'Stops indexing'
          }
        })

        .post('/indexer/reset', () => createSuccessResponse({ message: AnimeIndexer.reset() }), {
          detail: {
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
              description:
                'Not really necessary, just a way to manually process the update queue, scheduler does it as well'
            }
          }
        )
    );
};

export { animeRoute };
