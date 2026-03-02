import { parseNumber, parseString } from 'src/helpers/parsers';
import { ShikimoriAnime } from './types';
import { getKey, Redis } from 'src/helpers/redis.util';
import { ShikimoriFetch } from './helpers/shikimori.fetch';
import { Anilist } from '../anilist';
import { ProviderModule } from 'src/helpers/module';
import { Anime } from '../../anime';
import { AnimeChronologyPayload, AnimeScreenshotPayload, AnimeVideoPayload } from '../../types';
import { forced } from 'src/helpers/forced';

class ShikimoriModule extends ProviderModule<ShikimoriAnime> {
  override readonly name = 'Shikimori';

  override async getInfo(id: number, idMal?: number): Promise<ShikimoriAnime> {
    const key = getKey(this.name, 'info', id);

    const cached = await Redis.get<ShikimoriAnime>(key);

    if (cached) {
      return cached;
    }

    const info = await this.resolveInfo(id, idMal);

    if (info.videos) {
      const videos: AnimeVideoPayload[] = info.videos.map((v) => {
        return {
          url: v.url!,
          title: v.name,
          thumbnail: v.imageUrl,
          type: v.kind,
          source: this.name
        } satisfies AnimeVideoPayload;
      });

      await Anime.upsert({ id, videos });
    }

    if (info.screenshots) {
      const screenshots: AnimeScreenshotPayload[] = info.screenshots.map((s, i) => {
        return {
          url: s.originalUrl!!,
          order: i,
          small: s.x166Url,
          medium: s.x332Url,
          large: s.originalUrl,
          source: this.name
        } satisfies AnimeScreenshotPayload;
      });

      await Anime.upsert({ id, screenshots });
    }

    if (info.russian) {
      await Anime.upsert({
        id,
        other_titles: {
          title: info.russian,
          source: this.name,
          language: 'russian'
        }
      });
    }

    if (info.description) {
      await Anime.upsert({
        id,
        other_descriptions: {
          description: info.description,
          source: this.name,
          language: 'russian'
        }
      });
    }

    if (info.poster) {
      await Anime.upsert({
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
      await Anime.upsert({ id, franchise: info.franchise });
    }

    if (info.rating) {
      await Anime.upsert({ id, age_rating: info.rating });
    }

    if (info.episodesAired) {
      await Anime.upsert({ id, episodes_aired: info.episodesAired });
    }

    if (info.episodes) {
      await Anime.upsert({ id, episodes_total: info.episodes });
    }

    if (info.chronology) {
      const chronology: AnimeChronologyPayload[] = info.chronology.reverse().map((c, i) => {
        return {
          parent_id: parseNumber(info.id)!,
          related_id: parseNumber(c.id)!,
          order: i
        } satisfies AnimeChronologyPayload;
      });
      await Anime.upsert({ id, chronology: forced(chronology) });
    }

    await Redis.set(key, info);

    return info;
  }

  async resolveInfo(id: number, idMal?: number) {
    if (idMal) {
      const info = await ShikimoriFetch.fetchInfo(parseString(idMal)!);

      await Anime.upsert({
        id,
        links: {
          link: parseString(idMal)!,
          label: this.name,
          type: 'mapping'
        }
      });

      return info;
    } else {
      const idMap = await Anime.map(id, this.name);

      if (idMap) {
        return ShikimoriFetch.fetchInfo(idMap);
      } else {
        const al = await Anilist.getInfo(id);

        if (!al.idMal) {
          throw new Error('Anime not found');
        }

        const info = await ShikimoriFetch.fetchInfo(parseString(al.idMal)!);

        await Anime.upsert({
          id,
          links: {
            link: parseString(al.idMal)!,
            label: this.name,
            type: 'mapping'
          }
        });

        return info;
      }
    }
  }
}

const Shikimori = new ShikimoriModule();

export { Shikimori, ShikimoriModule };
