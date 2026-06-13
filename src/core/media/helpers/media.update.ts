import logger from 'src/helpers/logger';
import { sleep } from 'bun';
import { Config } from 'src/config';
import lock from 'src/helpers/lock';
import { EnableSchedule, Scheduled, Schedule } from 'src/helpers/schedule';
import { Module } from 'src/helpers/module';
import { db, updateQueue } from 'src/db';
import { count, eq, lt, sql } from 'drizzle-orm';
import { AnilistFetch, AnilistUtils } from '../providers';
import { Anime } from 'src/core';
import { MediaUpdateFetch } from './media.update.fetch';
import { Media } from '../media';

@EnableSchedule
class MediaUpdateModule extends Module {
  override readonly name = 'MediaUpdate';

  private async cleanupOldQueueItems() {
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      await db.delete(updateQueue).where(lt(updateQueue.added_at, oneDayAgo));
    } catch (e) {
      logger.error('Failed to cleanup old queue items:', e);
    }
  }

  private async addToQueue(anime: { id: number; id_mal: number | null | undefined }) {
    try {
      await db
        .insert(updateQueue)
        .values({
          anime_id: anime.id,
          mal_id: anime.id_mal,
          added_at: new Date(),
          updated_at: new Date()
        })
        .onConflictDoUpdate({
          target: updateQueue.anime_id,
          set: {
            updated_at: sql`excluded.updated_at`
          }
        });
    } catch (e) {
      logger.error(`Failed to add anime ${anime.id} to queue:`, e);
    }
  }

  private async removeFromQueue(animeId: number) {
    try {
      await db.delete(updateQueue).where(eq(updateQueue.anime_id, animeId));
    } catch (error) {
      logger.error(`Failed to remove queue item ${animeId} from database:`, error);
    }
  }

  async clearQueue() {
    try {
      await db.delete(updateQueue);
      logger.log('Queue cleared manually');
    } catch (e) {
      logger.error('Failed to clear queue:', e);
    }
  }

  async queueRecentAnime() {
    const data = await MediaUpdateFetch.getRecentAiredAnime();
    logger.log(`Adding ${data.length} recent aired anime to queue`);

    for (const anime of data) {
      await this.addToQueue(anime);
    }
  }

  async queueTodayAnime() {
    const data = await MediaUpdateFetch.getTodayAiredAnime();
    logger.log(`Adding ${data.length} today aired anime to queue`);

    for (const anime of data) {
      await this.addToQueue(anime);
    }
  }

  async queueYesterdayAnime() {
    const data = await MediaUpdateFetch.getYesterdayAiredAnime();
    logger.log(`Adding ${data.length} yesterday aired anime to queue`);

    for (const anime of data) {
      await this.addToQueue(anime);
    }
  }

  async processQueue() {
    if (!Config.anime_update_enabled) {
      logger.log('Updates disabled. Skipping queue processing.');
      return;
    }

    if (!lock.acquire('update')) {
      logger.log('Update already in progress. Skipping queue processing.');
      return;
    }

    try {
      await this.cleanupOldQueueItems();

      const queueCount = (await db.select({ count: count() }).from(updateQueue))[0]?.count ?? 0;
      logger.log(`Processing queue with ${queueCount} items...`);

      const items = await db.query.updateQueue.findMany({
        orderBy: {
          updated_at: 'desc'
        },
        limit: 50
      });

      // for (const item of items) {
      //   if (await Anime.exists(item.anime_id)) {
      //     if (await Anime.shouldAutoUpdate(item.anime_id)) {
      //       await Anime.initProviders(item.anime_id);
      //     } else {
      //       logger.log(`Wont update anime: ${item.anime_id}...`);
      //     }
      //   } else {
      //     await Anime.initProviders(item.anime_id);
      //   }

      //   await this.removeFromQueue(item.anime_id);

      //   await sleep(Config.anime_processing_delay * 1000);
      // }

      const response = await AnilistFetch.fetchInfoBulkIds(items.map((i) => i.anime_id));

      for (const anime of response.media) {
        logger.log(`Processing anime ${anime.id}`);

        if (await Media.exists(anime.id)) {
          if (await Media.shouldAutoUpdate(anime.id)) {
            await Anime.saveAndInit(AnilistUtils.anilistToMediaPayload(anime));
          } else {
            logger.log(`Wont update anime: ${anime.id}...`);
          }
        } else {
          await Anime.saveAndInit(AnilistUtils.anilistToMediaPayload(anime));
        }

        await this.removeFromQueue(anime.id);

        await sleep(Config.anime_processing_delay * 1000);
      }

      logger.log(`Processed ${queueCount} anime from queue.`);
    } catch (e) {
      logger.error('Failed during queue processing:', e);
    } finally {
      lock.release('update');
    }
  }

  @Scheduled(Schedule.every30Minutes(), Config.anime_update_enabled)
  async scheduleProcessQueue() {
    await this.processQueue();
  }

  @Scheduled(Schedule.everyHour(), Config.anime_update_enabled)
  async scheduleRecentAnime() {
    await this.queueRecentAnime();
  }

  @Scheduled(Schedule.every6Hours(), Config.anime_update_enabled)
  async scheduleTodayAnime() {
    await this.queueTodayAnime();
  }

  @Scheduled(Schedule.every12Hours(), Config.anime_update_enabled)
  async scheduleYesterdayAnime() {
    await this.queueYesterdayAnime();
  }
}

const MediaUpdate = new MediaUpdateModule();

export { MediaUpdate, MediaUpdateModule };
