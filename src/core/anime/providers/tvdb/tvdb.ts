import { NotFoundError } from 'src/helpers/errors';
import { TvdbInfoResult } from './types';
import { getKey, Redis } from 'src/helpers/redis.util';
import { parseString } from 'src/helpers/parsers';
import { Anilist } from '../anilist';
import { TvdbFetch } from './helpers/tvdb.fetch';
import { normalize_iso_639_1 } from 'src/helpers/languages';
import { ProviderModule } from 'src/helpers/module';
import { Tmdb } from '../tmdb';
import { AnimeUtils } from '../../helpers';
import { Anime } from '../../anime';
import { AnimeArtworkPayload } from '../../types';

class TvdbModule extends ProviderModule<TvdbInfoResult> {
  override readonly name = 'TVDB';

  override async getInfo(id: number): Promise<TvdbInfoResult> {
    const key = getKey(this.name, 'info', id);

    const cached = await Redis.get<TvdbInfoResult>(key);

    if (cached) {
      return cached;
    }

    const al = await Anilist.getInfo(id);

    if (!al) {
      throw new NotFoundError('Anilist not found');
    }

    const type = AnimeUtils.getType(al.format);

    const tvdbId = await Anime.map(id, this.name);
    const tmdbId = await Anime.map(id, Tmdb.name);

    let info: TvdbInfoResult | undefined = undefined;

    if (tvdbId) {
      info = type === 'movie' ? await TvdbFetch.fetchMovie(tvdbId) : await TvdbFetch.fetchSeries(tvdbId);
    } else if (tmdbId) {
      const search = await TvdbFetch.searchByRemote(
        tmdbId,
        type,
        al.title.romaji ?? al.title.native ?? al.title.english ?? ''
      );

      info = type === 'movie' ? await TvdbFetch.fetchMovie(search.id) : await TvdbFetch.fetchSeries(search.id);

      await Anime.upsert({
        id,
        links: {
          link: parseString(info.id)!,
          label: this.name,
          type: 'mapping'
        }
      });
    }

    if (!info) {
      throw new NotFoundError('TVDB not found');
    }

    if (info.artworks) {
      const artworks: AnimeArtworkPayload[] = info.artworks.map((a) => {
        return {
          url: a.image!,
          large: a.image,
          width: a.width,
          height: a.height,
          iso_639_1: normalize_iso_639_1(a.language) ?? undefined,
          medium: a.thumbnail,
          type: AnimeUtils.unifyArtworkType(a.type),
          source: this.name
        } satisfies AnimeArtworkPayload;
      });

      await Anime.upsert({ id, artworks });
    }

    await Redis.set(key, info);

    return info;
  }
}

const Tvdb = new TvdbModule();

export { Tvdb, TvdbModule };
