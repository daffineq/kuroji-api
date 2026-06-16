import Elysia from 'elysia';
import { Migrations } from './migrations';
import { createSuccessResponse } from 'src/helpers/response';

export const migrationsRoute = () => {
  return (app: Elysia) =>
    app.group('/migrations', { tags: ['Migrations'] }, (app) =>
      app.post(
        '/slugs',
        async () => {
          await Migrations.migrate_slugs();

          return createSuccessResponse({
            message: 'Migrated slugs'
          });
        },
        {
          detail: {
            summary: 'Migrate Slugs',
            description: 'Updated media that doesnt have slug'
          }
        }
      )
    );
};
