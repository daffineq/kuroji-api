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
              summary: 'Patch Media Statistics',
              description: `Tracks and updates statistics for a media entry. Supported types:\n- **view**: Increments the view counter, synced to hourly/daily/weekly/monthly aggregates\n- **score**: Updates the local score distribution (1–5 star system). Requires \`tag\` (score value) and \`action\` (add/remove)\n- **favorite**: Increments or decrements local favorites count. Requires \`action\` (add/remove)\n- **status**: Updates local status distribution. Requires \`tag\` (0=Current, 1=Planning, 2=Paused, 3=Dropped, 4=Completed) and \`action\` (add/remove)`
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
              summary: 'Patch Episode Statistics',
              description: `Tracks and updates view statistics for a specific episode of a media entry. Supported types:\n- **view**: Increments the episode view counter, batched and synced on a scheduled flush`
            }
          }
        )
    );
};

export { mediaRoute };
