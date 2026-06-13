import Elysia, { t } from 'elysia';
import { createSuccessResponse } from 'src/helpers/response';
import { MediaIndexer } from './media.indexer';

const mediaIndexerRoute = () => {
  return (app: Elysia) =>
    app.group('/media/indexer', { tags: ['Media Indexer'] }, (app) =>
      app
        .post(
          '/start',
          async ({ query }) =>
            createSuccessResponse({
              message: await MediaIndexer.start({
                delay: query.delay,
                status: query.status,
                threshold: query.threshold,
                type: query.type
              })
            }),
          {
            query: t.Object({
              delay: t.Optional(t.Number({ default: 5 })),
              status: t.Optional(t.String({ description: 'Media status from anilist' })),
              threshold: t.Optional(t.Number({ description: 'Media popularity threshold' })),
              type: t.Optional(t.String({ description: 'Media type' }))
            }),
            detail: {
              summary: 'Start Indexer',
              description: 'Starts indexing media'
            }
          }
        )

        .post('/stop', () => createSuccessResponse({ message: MediaIndexer.stop() }), {
          detail: {
            summary: 'Stop Indexer',
            description: 'Stops indexing'
          }
        })

        .post('/reset', ({ query }) => createSuccessResponse({ message: MediaIndexer.reset(query.status) }), {
          query: t.Object({
            status: t.Optional(t.String({ description: 'Media status from anilist' }))
          }),
          detail: {
            summary: 'Reset Indexer',
            description: 'Resets the state of indexer, it will start from page 1 on next start'
          }
        })

        .post(
          '/embeddings/start',
          async () => createSuccessResponse({ message: await MediaIndexer.start_embeddings() }),
          {
            detail: {
              summary: 'Start Embeddings',
              description: 'Starts an embedding indexing, requires openai api key'
            }
          }
        )
    );
};

export { mediaIndexerRoute };
