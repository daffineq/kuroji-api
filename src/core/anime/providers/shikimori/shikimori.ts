import { parseNumber, parseString } from 'src/helpers/parsers';
import { ShikimoriAnime } from './types';
import { getKey, Redis } from 'src/helpers/redis.util';
import { ShikimoriFetch } from './helpers/shikimori.fetch';
import { Anilist } from '../anilist';
import { ChronologyEntry, Meta, ScreenshotEntry, VideoEntry } from '../../meta';
import { ProviderModule } from 'src/helpers/module';

class ShikimoriModule extends ProviderModule<ShikimoriAnime> {
  override readonly name = 'Shikimori';

  override async getInfo(id: number, idMal?: number): Promise<ShikimoriAnime> {
    const key = getKey(this.name, 'info', id);

    const cached = await Redis.get<ShikimoriAnime>(key);

    if (cached) {
      return cached;
    }

    let fetched: ShikimoriAnime;

    if (idMal) {
      fetched = await ShikimoriFetch.fetchInfo(parseString(idMal)!);

      await Meta.update({
        id,
        mappings: {
          id: idMal,
          name: this.name
        }
      });
    } else {
      const meta = await Meta.fetchOrCreate(id).catch(() => null);

      const shikId = meta?.mappings.find((m) => m.source_name === this.name)?.source_id;

      if (shikId) {
        fetched = await ShikimoriFetch.fetchInfo(shikId);
      } else {
        const al = await Anilist.getInfo(id);

        if (!al.idMal) {
          throw new Error('Anime not found');
        }

        fetched = await ShikimoriFetch.fetchInfo(parseString(al.idMal)!);

        await Meta.update({
          id,
          mappings: {
            id: al.idMal,
            name: this.name
          }
        });
      }
    }

    if (fetched.videos) {
      const videos: VideoEntry[] = fetched.videos.map((v) => {
        return {
          url: v.url!,
          title: v.name,
          thumbnail: v.imageUrl,
          type: v.kind,
          source: this.name
        } satisfies VideoEntry;
      });

      await Meta.update({ id, videos });
    }

    if (fetched.screenshots) {
      const screenshots: ScreenshotEntry[] = fetched.screenshots.map((s) => {
        return {
          url: s.originalUrl!!,
          small: s.x166Url,
          medium: s.x332Url,
          large: s.originalUrl,
          source: this.name
        } satisfies ScreenshotEntry;
      });

      await Meta.update({ id, screenshots });
    }

    if (fetched.russian) {
      await Meta.update({
        id,
        titles: {
          title: fetched.russian,
          source: this.name,
          language: 'russian'
        }
      });
    }

    if (fetched.description) {
      await Meta.update({
        id,
        descriptions: {
          description: fetched.description,
          source: this.name,
          language: 'russian'
        }
      });
    }

    if (fetched.poster) {
      await Meta.update({
        id,
        images: {
          url: fetched.poster.originalUrl!,
          medium: fetched.poster.mainUrl!,
          large: fetched.poster.originalUrl!,
          type: 'poster',
          source: this.name
        }
      });
    }

    if (fetched.franchise) {
      await Meta.update({ id, franchise: fetched.franchise });
    }

    if (fetched.rating) {
      await Meta.update({ id, rating: fetched.rating });
    }

    if (fetched.episodesAired) {
      await Meta.update({ id, episodes_aired: fetched.episodesAired });
    }

    if (fetched.episodes) {
      await Meta.update({ id, episodes_total: fetched.episodes });
    }

    if (fetched.chronology) {
      const chronology: ChronologyEntry[] = fetched.chronology.reverse().map((c, i) => {
        return {
          parentId: parseNumber(fetched.id)!,
          relatedId: parseNumber(c.id)!,
          order: i
        } satisfies ChronologyEntry;
      });
      await Meta.update({ id, chronologies: chronology });
    }

    await Redis.set(key, fetched);

    return fetched;
  }
}

const Shikimori = new ShikimoriModule();

export { Shikimori, ShikimoriModule };
