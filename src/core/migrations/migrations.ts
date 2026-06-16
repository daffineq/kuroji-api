import { count, isNull, sql } from 'drizzle-orm';
import { db, media } from 'src/db';
import logger from 'src/helpers/logger';
import { Module } from 'src/helpers/module';
import { getSlug } from 'src/helpers/utils';

class MigrationsModule extends Module {
  override readonly name = 'Migrations';

  async migrate_slugs() {
    logger.log('Started slugs migration');

    try {
      const perPage = 100;
      const total = (await db.select({ count: count() }).from(media).where(isNull(media.slug)))[0]?.count ?? 0;

      for (let i = 0; i < Math.ceil(total / perPage); i++) {
        const data = await db.query.media.findMany({
          where: {
            slug: {
              isNull: true
            }
          },
          columns: {
            id: true
          },
          with: {
            title: true
          },
          limit: perPage
        });

        if (data.length === 0) break;

        await db
          .insert(media)
          .values(
            data.map((m) => ({
              id: m.id,
              slug: getSlug(m.title?.romaji ?? 'No Title')
            }))
          )
          .onConflictDoUpdate({
            target: media.id,
            set: {
              slug: sql`excluded.slug`
            }
          });
      }
    } catch (err) {
      logger.error('Failed slugs migration:', err);
    } finally {
      logger.log('Finished slugs migration');
    }
  }
}

const Migrations = new MigrationsModule();

export { Migrations, MigrationsModule };
