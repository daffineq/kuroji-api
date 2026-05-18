import Elysia, { t } from 'elysia';
import { createSuccessResponse } from 'src/helpers/response';
import { AnimeIndexer } from './anime.indexer';

const animeIndexerRoute = () => {
  return (app: Elysia) =>
    app.group('/anime/indexer', { tags: ['Anime Indexer'] }, (app) =>
      app
        .post(
          '/start',
          async ({ query }) =>
            createSuccessResponse({
              message: await AnimeIndexer.start({
                delay: query.delay,
                status: query.status,
                threshold: query.threshold
              })
            }),
          {
            query: t.Object({
              delay: t.Optional(t.Number({ default: 5 })),
              status: t.Optional(t.String({ description: 'Anime status from anilist' })),
              threshold: t.Optional(t.Number({ description: 'Anime popularity threshold' }))
            }),
            detail: {
              summary: 'Start Indexer',
              description: 'Starts indexing animes'
            }
          }
        )

        .post('/stop', () => createSuccessResponse({ message: AnimeIndexer.stop() }), {
          detail: {
            summary: 'Stop Indexer',
            description: 'Stops indexing'
          }
        })

        .post('/reset', ({ query }) => createSuccessResponse({ message: AnimeIndexer.reset(query.status) }), {
          query: t.Object({
            status: t.Optional(t.String({ description: 'Anime status from anilist' }))
          }),
          detail: {
            summary: 'Reset Indexer',
            description: 'Resets the state of indexer, it will start from page 1 on next start'
          }
        })
    );
};

export { animeIndexerRoute };
