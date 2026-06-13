import logger from 'src/helpers/logger';
import { Module } from 'src/helpers/module';
import { db } from 'src/db';

class MediaUpdateFetchModule extends Module {
  override readonly name = 'AnimeUpdateFetch';

  async getRecentAiredAnime(hoursBack: number = 4) {
    try {
      const now = Math.floor(Date.now() / 1000);

      const start = now - hoursBack * 60 * 60;
      const end = now + hoursBack * 60 * 60;

      const aired = await db.query.media.findMany({
        where: {
          airing_schedule: {
            airing_at: {
              gte: start,
              lte: end
            }
          }
        },
        columns: {
          id: true,
          id_mal: true,
          popularity: true
        },
        orderBy: (anime, { desc }) => [desc(anime.trending)]
      });

      logger.log(
        `Found ${aired.length} anime aired (${new Date(start * 1000).toISOString()} - ${new Date(end * 1000).toISOString()})`
      );

      return aired;
    } catch (error) {
      logger.error('Error fetching recent aired anime:', error);
      return [];
    }
  }

  async getTodayAiredAnime() {
    try {
      const now = Math.floor(Date.now() / 1000);

      const start = now - 24 * 60 * 60;
      const end = now;

      const aired = await db.query.media.findMany({
        where: {
          airing_schedule: {
            airing_at: {
              gte: start,
              lte: end
            }
          }
        },
        columns: {
          id: true,
          id_mal: true,
          popularity: true
        },
        orderBy: {
          trending: 'desc'
        }
      });

      logger.log(`Found ${aired.length} anime aired today`);

      return aired;
    } catch (error) {
      logger.error('Error fetching today aired anime:', error);
      return [];
    }
  }

  async getYesterdayAiredAnime() {
    try {
      const now = Math.floor(Date.now() / 1000);

      const start = now - 48 * 60 * 60;
      const end = now - 24 * 60 * 60;

      const aired = await db.query.media.findMany({
        where: {
          airing_schedule: {
            airing_at: {
              gte: start,
              lte: end
            }
          }
        },
        columns: {
          id: true,
          id_mal: true,
          popularity: true
        },
        orderBy: {
          trending: 'desc'
        }
      });

      logger.log(`Found ${aired.length} anime aired yesterday`);

      return aired;
    } catch (error) {
      logger.error('Error fetching yesterday aired anime:', error);
      return [];
    }
  }
}

const MediaUpdateFetch = new MediaUpdateFetchModule();

export { MediaUpdateFetch, MediaUpdateFetchModule };
