import lock from 'src/helpers/lock';
import { sleep } from 'bun';
import logger from 'src/helpers/logger';
import { EnableSchedule, Scheduled, Schedule } from 'src/helpers/schedule';
import { Config } from 'src/config';
import { Anime } from '../../anime';
import { Module } from 'src/helpers/module';
import {
  db,
  indexerState,
  media,
  mediaEmbedding,
  mediaGenre,
  mediaTag,
  mediaTitle,
  mediaToGenre,
  mediaToTag
} from 'src/db';
import { count, eq, inArray, sql } from 'drizzle-orm';
import { Media } from '../media';
import { AnilistFetch, AnilistUtils } from '../providers';
import { groupBy } from 'src/helpers/utils';
import { openai } from 'src/lib/openai';

@EnableSchedule
class MediaIndexerModule extends Module {
  override readonly name = 'MediaIndexer';

  private async index(
    options: { delay?: number; status?: string; threshold?: number; type?: string } = {}
  ): Promise<void> {
    if (!lock.acquire('indexer')) {
      logger.log('Indexer already running, skipping new run.');
      return;
    }

    const { delay = Config.anime_processing_delay, status, type } = options;

    try {
      const state = await this.getState(status);
      let page = state?.last_page ?? 1;
      let hasNextPage = true;
      let failedCount = 0;
      let popularityLesser: number | undefined = state?.last_pl ?? undefined;

      const perPage = 50;
      const maxFails = 3;
      const maxTries = 3;

      logger.log(`Starting index from page ${page}...`);

      while (hasNextPage) {
        logger.log(`Fetching media from page ${page}...`);

        let response;
        let currentTry = 0;

        while (currentTry < maxTries) {
          try {
            response = await AnilistFetch.fetchInfoBulk(page, perPage, {
              ...options,
              threshold_lesser: popularityLesser
            });
            failedCount = 0;
            break;
          } catch (err) {
            logger.error(`Failed to fetch page ${page}:`, err);
            currentTry++;

            if (currentTry < maxTries) {
              await sleep(240 * 1000);
            }
          }
        }

        if (currentTry >= maxTries) {
          failedCount++;

          if (failedCount >= maxFails) {
            logger.error('Too many failed, exiting');
            return;
          }

          page++;
          await this.setState(page, popularityLesser, status);
          continue;
        }

        if (!response) {
          logger.error('No response from anilist api');
          return;
        }

        hasNextPage = response.pageInfo.hasNextPage;

        for (const media of response.media) {
          if (!lock.isLocked('indexer')) {
            logger.log('Indexing stopped.');
            return;
          }

          logger.log(`Indexing media: ${media.id}...`);

          if (await Media.exists(media.id)) {
            if (await Media.shouldAutoUpdate(media.id)) {
              if (media.type === 'ANIME') {
                await Anime.saveAndInit(AnilistUtils.anilistToMediaPayload(media));
              } else {
                await Media.save(AnilistUtils.anilistToMediaPayload(media));
              }
            } else {
              logger.log(`Wont update media: ${media.id}...`);
            }
          } else {
            if (media.type === 'ANIME') {
              await Anime.saveAndInit(AnilistUtils.anilistToMediaPayload(media));
            } else {
              await Media.save(AnilistUtils.anilistToMediaPayload(media));
            }
          }

          await sleep(delay * 1000);
        }

        page++;

        if (page > 100) {
          const popularity = response.media[response.media.length - 1]?.popularity;

          if (popularity && popularity !== popularityLesser) {
            popularityLesser = response.media[response.media.length - 1]?.popularity;
            page = 1;
          }
        }

        await this.setState(page, popularityLesser, status);
      }

      if (!hasNextPage) {
        await this.setState(1, undefined, status);
      }

      logger.log('Indexing complete. All done');
    } catch (err) {
      logger.error('Unexpected error during indexing:', err);
    } finally {
      lock.release('indexer');
    }
  }

  private async index_embeddings() {
    if (!lock.acquire('embeddings')) {
      logger.log('Embedding indexer already running, skipping new run.');
      return;
    }

    if (!openai) {
      return;
    }

    const perPage = 100;
    const total = (await db.select({ count: count() }).from(media))[0]?.count ?? 0;

    logger.log(`indexing embeddings for ${total} anime...`);

    for (let i = 0; i < Math.ceil(total / perPage); i++) {
      const data = await db.query.media.findMany({
        columns: {
          id: true,
          description: true
        },
        with: {
          title: true,
          alt_descriptions: true
        },
        limit: perPage,
        offset: perPage * i
      });

      const ids = data.map((d) => d.id);

      const [genres, tags] = await Promise.all([
        db
          .select({ media_id: mediaToGenre.A, name: mediaGenre.name })
          .from(mediaToGenre)
          .innerJoin(mediaGenre, eq(mediaGenre.id, mediaToGenre.B))
          .where(inArray(mediaToGenre.A, ids)),

        db
          .select({ media_id: mediaToTag.media_id, name: mediaTag.name })
          .from(mediaToTag)
          .innerJoin(mediaTag, eq(mediaTag.id, mediaToTag.tag_id))
          .where(inArray(mediaToTag.media_id, ids))
      ]);

      const genresByMedia = groupBy(genres, (r) => r.media_id);
      const tagsByMedia = groupBy(tags, (r) => r.media_id);

      const texts = data.map((d) =>
        [
          d.title?.romaji,
          d.title?.english,
          d.title?.native,
          d.alt_descriptions.find((d) => d.source === 'tmdb')?.description ?? d.description,
          (genresByMedia.get(d.id) ?? [])
            .map((g) => g.name)
            .filter(Boolean)
            .join(', '),
          (tagsByMedia.get(d.id) ?? [])
            .map((t) => t.name)
            .filter(Boolean)
            .join(', ')
        ]
          .filter(Boolean)
          .join(' | ')
      );

      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: texts
      });

      await db
        .insert(mediaEmbedding)
        .values(
          data.map((d, idx) => ({
            media_id: d.id,
            embedding: response.data[idx]?.embedding
          }))
        )
        .onConflictDoUpdate({
          target: mediaEmbedding.media_id,
          set: { embedding: sql`excluded.embedding` }
        });

      console.log(`indexed ${Math.min((i + 1) * perPage, total)}/${total} embeddings`);
    }

    logger.log('embedding indexing done');
  }

  public async start(options: {
    delay?: number;
    status?: string;
    threshold?: number;
    type?: string;
  }): Promise<string> {
    if (lock.isLocked('indexer')) {
      logger.log('Indexer already running, skipping new run.');
      return 'Indexer already running';
    }

    logger.log('Starting indexing...');
    this.index(options).catch((err) => {
      logger.error('Error during indexing:', err);
    });

    return `Indexing started, estimated time: ${await this.calculateEstimatedTime(options)}`;
  }

  public async start_embeddings(): Promise<string> {
    if (!Config.has_openai_api_key) {
      return 'No OpenAI api key provided';
    }

    if (lock.isLocked('embeddings')) {
      logger.log('Embedding indexer already running, skipping new run.');
      return 'Embedding indexer already running';
    }

    logger.log('Starting embedding indexing...');
    this.index_embeddings().catch((err) => {
      logger.error('Error during embedding indexing:', err);
    });

    return 'Embedding indexer started';
  }

  public stop(): string {
    if (lock.isLocked('indexer')) {
      logger.log('Indexing stopped by request.');
      lock.release('indexer');
      return 'Indexing stopped';
    }

    return 'Nothing to stop';
  }

  public reset(status?: string): string {
    logger.log('Indexer had been reseted');
    lock.release('indexer');
    this.setState(1, undefined, status);
    return 'Reseted indexer';
  }

  @Scheduled(Schedule.everyOtherMonth(), Config.anime_reindexing_enabled)
  async scheduleIndex() {
    await this.index();
  }

  @Scheduled(Schedule.everyOtherDay(), Config.anime_reindexing_enabled)
  async scheduleIndexReleasing() {
    await this.index({ status: 'RELEASING' });
  }

  @Scheduled(Schedule.weeklyOn(6), Config.anime_reindexing_enabled)
  async scheduleIndexUpcoming() {
    await this.index({
      status: 'NOT_YET_RELEASED',
      threshold: Config.anime_popularity_threshold_upcoming
    });
  }

  public async calculateEstimatedTime(options: {
    delay?: number;
    status?: string;
    threshold?: number;
  }): Promise<string> {
    const { delay = Config.anime_processing_delay, status } = options;

    const fetched = ((await this.getState(status))?.last_page ?? 0) * 50;

    // Estimating count because anilist fixed the way i used to get count in anilist api
    const total = this.estimateCount(options);

    const remaining = Math.max(total - fetched, 0);

    const timeS = remaining * (delay + 10);
    const timeM = Math.floor(timeS / 60);
    const timeH = Math.floor(timeM / 60);
    const timeD = Math.floor(timeH / 24);

    return `${timeD} days, ${timeH % 24} hours, ${timeM % 60} minutes, ${timeS % 60} seconds`;
  }

  private estimateCount(options: { status?: string; threshold?: number } = {}): number {
    const { status, threshold = Config.anime_popularity_threshold } = options;

    const buckets: [number, number][] = [
      [50_000, 300],
      [30_000, 700],
      [20_000, 1_400],
      [10_000, 2_800],
      [7_500, 4_000],
      [5_000, 5_800],
      [2_500, 9_500],
      [1_000, 14_500],
      [500, 18_500],
      [100, 24_000]
    ];

    const statusRatio: Record<string, number> = {
      FINISHED: 0.63,
      RELEASING: 0.13,
      NOT_YET_RELEASED: 0.09,
      CANCELLED: 0.07,
      HIATUS: 0.01
    };

    if (threshold >= buckets[0]![0]) {
      return Math.round(buckets[0]![1] * (status ? (statusRatio[status] ?? 1) : 1));
    }

    if (threshold <= buckets[buckets.length - 1]![0]) {
      return Math.round(buckets[buckets.length - 1]![1] * (status ? (statusRatio[status] ?? 1) : 1));
    }

    for (let i = 0; i < buckets.length - 1; i++) {
      const [p1, c1] = buckets[i] ?? [0, 0];
      const [p2, c2] = buckets[i + 1] ?? [0, 0];

      if (threshold <= p1 && threshold >= p2) {
        const t = (threshold - p1) / (p1 - p2);
        const value = c1 + t * (c1 - c2);

        return Math.round(value * (status ? (statusRatio[status] ?? 1) : 1));
      }
    }

    return 0;
  }

  async getState(status?: string) {
    return db.query.indexerState.findFirst({
      where: {
        id: `anime-${status ? status.toLowerCase() : 'all'}`
      }
    });
  }

  async setState(page: number, pl?: number, status?: string): Promise<void> {
    await db
      .insert(indexerState)
      .values({
        id: `anime-${status ? status.toLowerCase() : 'all'}`,
        last_pl: pl,
        last_page: page
      })
      .onConflictDoUpdate({
        target: indexerState.id,
        set: {
          last_pl: sql`excluded.last_pl`,
          last_page: sql`excluded.last_page`
        }
      });
  }
}

const MediaIndexer = new MediaIndexerModule();

export { MediaIndexer, MediaIndexerModule };
