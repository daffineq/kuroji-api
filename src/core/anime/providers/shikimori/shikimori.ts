import { parseNumber, parseString } from 'src/helpers/parsers';
import { ShikimoriAnime } from './types';
import { getKey, Redis } from 'src/helpers/redis.util';
import { metaSelect } from '../../meta/types';
import { ShikimoriFetch } from './helpers/shikimori.fetch';
import { Anilist } from '../anilist';
import { ChronologyEntry, Meta, VideoEntry } from '../../meta';
import { ProviderModule } from 'src/helpers/module';

class ShikimoriModule extends ProviderModule<ShikimoriAnime> {
  override readonly name = 'Shikimori';
  override readonly logo =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTzTi198mtNZ3rGCr6adcXiJBEncgd_Xef_Q&s';

  override async getInfo(id: number, idMal?: number): Promise<ShikimoriAnime> {
    const key = getKey('shikimori', 'info', id);

    const cached = await Redis.get<ShikimoriAnime>(key);

    if (cached) {
      return cached;
    }

    let fetched: ShikimoriAnime;

    if (idMal) {
      fetched = await ShikimoriFetch.fetchInfo(parseString(idMal)!);

      await Meta.addSingleMapping(id, {
        id: idMal,
        name: 'shikimori'
      });
    } else {
      const meta = await Meta.fetchOrCreate(id, metaSelect).catch(() => null);

      const shikId = meta?.mappings.find((m) => m.source_name === 'shikimori')?.source_id;

      if (shikId) {
        fetched = await ShikimoriFetch.fetchInfo(shikId);
      } else {
        const al = await Anilist.getInfo(id);

        if (!al.idMal) {
          throw new Error('Anime not found');
        }

        fetched = await ShikimoriFetch.fetchInfo(parseString(al.idMal)!);

        await Meta.addSingleMapping(id, {
          id: al.idMal,
          name: 'shikimori'
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
          source: 'shikimori'
        };
      });

      await Meta.addVideos(id, videos);
    }

    if (fetched.screenshots) {
      await Meta.addScreenshots(id, fetched.screenshots);
    }

    if (fetched.russian) {
      await Meta.addSingleTitle(id, {
        title: fetched.russian,
        source: 'shikimori',
        language: 'russian'
      });
    }

    if (fetched.description) {
      await Meta.addSingleDescription(id, {
        description: fetched.description,
        source: 'shikimori',
        language: 'russian'
      });
    }

    if (fetched.poster) {
      await Meta.addSingleImage(id, {
        url: fetched.poster.originalUrl!,
        medium: fetched.poster.mainUrl!,
        large: fetched.poster.originalUrl!,
        type: 'poster',
        source: 'shikimori'
      });
    }

    if (fetched.franchise) {
      await Meta.addFranchise(id, fetched.franchise);
    }

    if (fetched.rating) {
      await Meta.addRating(id, fetched.rating);
    }

    if (fetched.episodesAired) {
      await Meta.addEpisodesAired(id, fetched.episodesAired);
    }

    if (fetched.episodes) {
      await Meta.addEpisodesTotal(id, fetched.episodes);
    }

    if (fetched.chronology) {
      const chronology: ChronologyEntry[] = fetched.chronology.reverse().map((c, i) => {
        return {
          parentId: parseNumber(fetched.id)!,
          relatedId: parseNumber(c.id)!,
          order: i
        };
      });
      await Meta.addChronologies(id, chronology);
    }

    await Redis.set(key, fetched);

    return fetched;
  }
}

const Shikimori = new ShikimoriModule();

export { Shikimori, ShikimoriModule };
