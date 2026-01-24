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

    let info: ShikimoriAnime;

    if (idMal) {
      info = await ShikimoriFetch.fetchInfo(parseString(idMal)!);

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
        info = await ShikimoriFetch.fetchInfo(shikId);
      } else {
        const al = await Anilist.getInfo(id);

        if (!al.idMal) {
          throw new Error('Anime not found');
        }

        info = await ShikimoriFetch.fetchInfo(parseString(al.idMal)!);

        await Meta.update({
          id,
          mappings: {
            id: al.idMal,
            name: this.name
          }
        });
      }
    }

    if (info.videos) {
      const videos: VideoEntry[] = info.videos.map((v) => {
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

    if (info.screenshots) {
      const screenshots: ScreenshotEntry[] = info.screenshots.map((s) => {
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

    if (info.russian) {
      await Meta.update({
        id,
        titles: {
          title: info.russian,
          source: this.name,
          language: 'russian'
        }
      });
    }

    if (info.description) {
      await Meta.update({
        id,
        descriptions: {
          description: info.description,
          source: this.name,
          language: 'russian'
        }
      });
    }

    if (info.poster) {
      await Meta.update({
        id,
        images: {
          url: info.poster.originalUrl!,
          medium: info.poster.mainUrl!,
          large: info.poster.originalUrl!,
          type: 'poster',
          source: this.name
        }
      });
    }

    if (info.franchise) {
      await Meta.update({ id, franchise: info.franchise });
    }

    if (info.rating) {
      await Meta.update({ id, rating: info.rating });
    }

    if (info.episodesAired) {
      await Meta.update({ id, episodes_aired: info.episodesAired });
    }

    if (info.episodes) {
      await Meta.update({ id, episodes_total: info.episodes });
    }

    if (info.chronology) {
      const chronology: ChronologyEntry[] = info.chronology.reverse().map((c, i) => {
        return {
          parentId: parseNumber(info.id)!,
          relatedId: parseNumber(c.id)!,
          order: i
        } satisfies ChronologyEntry;
      });
      await Meta.update({ id, chronologies: chronology });
    }

    await Redis.set(key, info);

    return info;
  }
}

const Shikimori = new ShikimoriModule();

export { Shikimori, ShikimoriModule };
