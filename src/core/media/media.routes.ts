import Elysia, { t } from 'elysia';
import { Media } from './media';
import { createSuccessResponse } from 'src/helpers/response';

const mediaRoute = () => {
  return (app: Elysia) =>
    app.group('/media', { tags: ['Media'] }, (app) =>
      app
        .patch(
          '/:id/statistics',
          async ({ params, body }) => {
            await Media.patchMediaStatistics(params.id, body);

            return createSuccessResponse({ message: 'Success' });
          },
          {
            params: t.Object({
              id: t.Number()
            }),
            body: t.Object({
              type: t.String(),
              action: t.Optional(t.String()),
              tag: t.Optional(t.String())
            }),
            detail: {
              summary: 'Media Statistics',
              description: 'Handles the media statistics'
            }
          }
        )

        .patch(
          '/:id/:ep/statistics',
          async ({ params, body }) => {
            await Media.patchEpisodeStatistics(params.id, params.ep, body);

            return createSuccessResponse({ message: 'Success' });
          },
          {
            params: t.Object({
              id: t.Number(),
              ep: t.Number()
            }),
            body: t.Object({
              type: t.String(),
              action: t.Optional(t.String()),
              tag: t.Optional(t.String())
            }),
            detail: {
              summary: 'Episode Statistics',
              description: 'Handles the episode statistics'
            }
          }
        )
    );
};

export { mediaRoute };
