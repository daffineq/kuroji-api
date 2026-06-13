import { and, eq, sql } from 'drizzle-orm';
import {
  db,
  media,
  mediaEpisode,
  mediaLink,
  mediaLocalScoreDistribution,
  mediaLocalStatusDistribution,
  mediaStatistic,
  mediaToLink
} from 'src/db';
import { Module } from 'src/helpers/module';
import { MediaPayload, MediaStatsPatchPayload } from './types';
import { MediaDb } from './helpers';
import { EnableSchedule, Schedule, Scheduled } from 'src/helpers/schedule';
import { getKey, Redis } from 'src/helpers/redis.util';
import { parseNumber } from 'src/helpers/parsers';
import logger from 'src/helpers/logger';
import { Config } from 'src/config';

@EnableSchedule
class MediaModule extends Module {
  override readonly name = 'Media';

  async save(payload: MediaPayload) {
    await MediaDb.upsert(payload);
  }

  async map(id: number, name: string) {
    const links = await db
      .select({ link: mediaLink })
      .from(mediaToLink)
      .innerJoin(mediaLink, eq(mediaLink.id, mediaToLink.B))
      .where(eq(mediaToLink.A, id));

    return links.find((l) => l.link?.label.toLowerCase() === name.toLowerCase())?.link?.link ?? null;
  }

  async shouldAutoUpdate(id: number) {
    const result = await db
      .select({ auto_update: media.auto_update })
      .from(media)
      .where(eq(media.id, id))
      .limit(1);

    return result[0]?.auto_update ?? true;
  }

  async exists(id: number) {
    const result = await db.select({ id: media.id }).from(media).where(eq(media.id, id)).limit(1);

    return result.length > 0;
  }

  async patchEpisodeStatistics(id: number, ep: number, payload: MediaStatsPatchPayload) {
    if (payload.type === 'view') {
      const key = getKey(this.name, 'views', id, ep);

      await Redis.incr(key);
    }

    await Redis.sadd('sync:active_ep_ids', [id, ep].join(':'));
  }

  async patchMediaStatistics(id: number, payload: MediaStatsPatchPayload) {
    if (payload.type === 'view') {
      const key = getKey(this.name, 'views', id);

      await Redis.incr(key);
    }

    if (payload.type === 'score' && payload.tag && payload.action) {
      const key = getKey(this.name, 'scores', payload.tag, id);

      if (payload.action === 'add') {
        await Redis.incr(key);
      } else {
        await Redis.decr(key);
      }
    }

    if (payload.type === 'favorite' && payload.action) {
      const key = getKey(this.name, 'favorites', id);

      if (payload.action === 'add') {
        await Redis.incr(key);
      } else {
        await Redis.decr(key);
      }
    }

    if (payload.type === 'status' && payload.action && payload.tag) {
      const key = getKey(this.name, 'statuses', payload.tag, id);

      if (payload.action === 'add') {
        await Redis.incr(key);
      } else {
        await Redis.decr(key);
      }
    }

    await Redis.sadd('sync:active_ids', id);
  }

  async processEpisodeStatistics() {
    const ids = await Redis.smembers('sync:active_ep_ids');

    if (!ids || ids.length === 0) return;

    logger.log(`Processing ${ids.length} episode stat updates`);

    const keys = new Set<string>();

    const viewUpdates: {
      id: number;
      ep: number;
      count: number;
    }[] = [];

    for (const id_str of ids) {
      const id = id_str.split(':')[0];
      const ep = id_str.split(':')[1];

      {
        const key = getKey(this.name, 'views', id, ep);
        const count = await Redis.getset(key, 0);

        if (count) {
          viewUpdates.push({ id: parseNumber(id)!, ep: parseNumber(ep)!, count: parseNumber(count)! });
        }

        keys.add(key);
      }
    }

    await db.transaction(async (tx) => {
      for (const update of viewUpdates) {
        await tx
          .update(mediaEpisode)
          .set({
            views: sql`${mediaEpisode.views} + ${update.count}`
          })
          .where(and(eq(mediaEpisode.media_id, update.id), eq(mediaEpisode.number, update.ep)));
      }

      if (keys.size > 0) {
        await Redis.del(...Array.from(keys));
      }

      await Redis.del('sync:active_ep_ids');
    });
  }

  async processAnimeStatistics() {
    const ids = await Redis.smembers('sync:active_ids');

    if (!ids || ids.length === 0) return;

    logger.log(`Processing ${ids.length} stat updates`);

    const keys = new Set<string>();

    const viewUpdates: {
      id: number;
      count: number;
    }[] = [];

    const favoriteUpdates: {
      id: number;
      count: number;
    }[] = [];

    const scoreUpdates: {
      id: number;
      scores: {
        count: number;
        score: number;
      }[];
    }[] = [];

    const statusUpdates: {
      id: number;
      statuses: {
        count: number;
        status: number;
      }[];
    }[] = [];

    for (const id of ids) {
      {
        const key = getKey(this.name, 'views', id);
        const count = await Redis.getset(key, 0);

        if (count) {
          viewUpdates.push({ id: parseNumber(id)!, count: parseNumber(count)! });
        }

        keys.add(key);
      }

      {
        const key = getKey(this.name, 'favorites', id);
        const count = await Redis.getset(key, 0);

        if (count) {
          favoriteUpdates.push({ id: parseNumber(id)!, count: parseNumber(count)! });
        }

        keys.add(key);
      }

      {
        const scores: {
          count: number;
          score: number;
        }[] = [];

        // 5 star system
        for (let i = 1; i <= 5; i++) {
          const key = getKey(this.name, 'scores', i, id);
          const count = await Redis.getset(key, 0);

          if (count) {
            scores.push({ count: parseNumber(count)!, score: i });
          }

          keys.add(key);
        }

        scoreUpdates.push({ id: parseNumber(id)!, scores });
      }

      {
        const statuses: {
          count: number;
          status: number;
        }[] = [];

        // 5 statuses
        // 0 -> Current
        // 1 -> Planning
        // 2 -> Paused
        // 3 -> Dropped
        // 4 -> Completed
        for (let i = 0; i < 5; i++) {
          const key = getKey(this.name, 'statuses', i, id);
          const count = await Redis.getset(key, 0);

          if (count) {
            statuses.push({ count: parseNumber(count)!, status: i });
          }

          keys.add(key);
        }

        statusUpdates.push({ id: parseNumber(id)!, statuses });
      }
    }

    await db.transaction(async (tx) => {
      for (const update of viewUpdates) {
        await tx
          .insert(mediaStatistic)
          .values({
            media_id: update.id,
            views_count: update.count
          })
          .onConflictDoUpdate({
            target: [mediaStatistic.media_id, mediaStatistic.record_date],
            set: {
              views_count: sql`${mediaStatistic.views_count} + excluded.views_count`
            }
          });

        const [stats] = await tx
          .select({
            total: sql<number>`sum(${mediaStatistic.views_count})`,
            today: sql<number>`sum(${mediaStatistic.views_count}) filter (where ${mediaStatistic.record_date} = current_date)`,
            week: sql<number>`sum(${mediaStatistic.views_count}) filter (where ${mediaStatistic.record_date} > current_date - interval '7 days')`,
            month: sql<number>`sum(${mediaStatistic.views_count}) filter (where ${mediaStatistic.record_date} > current_date - interval '30 days')`
          })
          .from(mediaStatistic)
          .where(eq(mediaStatistic.media_id, update.id));

        await tx
          .update(media)
          .set({
            views_total: Number(stats?.total) || 0,
            views_hour: update.count,
            views_today: Number(stats?.today) || 0,
            views_week: Number(stats?.week) || 0,
            views_month: Number(stats?.month) || 0
          })
          .where(eq(media.id, update.id));
      }

      for (const update of favoriteUpdates) {
        await tx
          .update(media)
          .set({
            local_favorites: sql`${media.local_favorites} + ${update.count}`
          })
          .where(eq(media.id, update.id));
      }

      for (const update of scoreUpdates) {
        const scores = update.scores.map((s) => {
          return {
            media_id: update.id,
            score: s.score,
            amount: s.count
          };
        });

        if (scores.length === 0) continue;

        await tx
          .insert(mediaLocalScoreDistribution)
          .values(scores)
          .onConflictDoUpdate({
            target: [mediaLocalScoreDistribution.media_id, mediaLocalScoreDistribution.score],
            set: {
              amount: sql`${mediaLocalScoreDistribution.amount} + excluded.amount`
            }
          });

        const [result] = await tx
          .select({
            average_score: sql<number>`
                SUM(${mediaLocalScoreDistribution.score} * ${mediaLocalScoreDistribution.amount})::float /
                NULLIF(SUM(${mediaLocalScoreDistribution.amount}), 0)
              `
          })
          .from(mediaLocalScoreDistribution)
          .where(eq(mediaLocalScoreDistribution.media_id, update.id));

        await tx
          .update(media)
          .set({
            score: result?.average_score ? Math.round(result.average_score * 100) / 100 : 0
          })
          .where(eq(media.id, update.id));
      }

      for (const update of statusUpdates) {
        const statuses = update.statuses.map((s) => {
          return {
            media_id: update.id,
            status: s.status,
            amount: s.count
          };
        });

        if (statuses.length === 0) continue;

        await tx
          .insert(mediaLocalStatusDistribution)
          .values(statuses)
          .onConflictDoUpdate({
            target: [mediaLocalStatusDistribution.media_id, mediaLocalStatusDistribution.status],
            set: {
              amount: sql`${mediaLocalStatusDistribution.amount} + excluded.amount`
            }
          });
      }

      if (keys.size > 0) {
        await Redis.del(...Array.from(keys));
      }

      await Redis.del('sync:active_ids');
    });
  }

  @Scheduled(Schedule.everyHour(), Config.statistics_enabled)
  async processStatistics() {
    await this.processAnimeStatistics();
    await this.processEpisodeStatistics();
  }
}

const Media = new MediaModule();

export { Media, MediaModule };
