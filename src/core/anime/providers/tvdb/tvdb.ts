import { NotFoundError } from 'src/helpers/errors';
import { getTypeNameById, TvdbInfoResult } from './types';
import meta from '../../meta/meta';
import { getTvdbTypeByAl } from './helpers/tvdb.utils';
import { getKey, Redis } from 'src/helpers/redis.util';
import tvdbFetch from './helpers/tvdb.fetch';
import { parseString } from 'src/helpers/parsers';
import { metaSelect } from '../../meta/types';
import anilist from '../anilist/anilist';
import { ArtworkEntry } from '../../meta/helpers/meta.dto';

class Tvdb {
  async getInfo(id: number): Promise<TvdbInfoResult> {
    const key = getKey('tvdb', 'info', id);

    const cached = await Redis.get<TvdbInfoResult>(key);

    if (cached) {
      return cached;
    }

    const al = await anilist.getInfo(id);

    if (!al) {
      throw new NotFoundError('Anilist not found');
    }

    const type = getTvdbTypeByAl(al.format);

    const mapping = await meta.fetchOrCreate(id, metaSelect);

    const tvdbId = mapping.mappings.find((m) => m.sourceName === 'tvdb')?.sourceId;
    const tmdbId = mapping.mappings.find((m) => m.sourceName === 'tmdb')?.sourceId;

    var tvdb: TvdbInfoResult | undefined = undefined;

    if (tvdbId) {
      tvdb = type === 'movie' ? await tvdbFetch.fetchMovie(tvdbId) : await tvdbFetch.fetchSeries(tvdbId);
    } else if (tmdbId) {
      const search = await tvdbFetch.searchByRemote(
        tmdbId,
        type,
        al.title.romaji ?? al.title.native ?? al.title.english ?? ''
      );

      tvdb = type === 'movie' ? await tvdbFetch.fetchMovie(search.id) : await tvdbFetch.fetchSeries(search.id);

      await meta.addMapping(id, {
        id: parseString(tvdb.id)!,
        name: 'tvdb'
      });
    }

    if (!tvdb) {
      throw new NotFoundError('TVDB not found');
    }

    if (tvdb.artworks) {
      const artworks: ArtworkEntry[] = tvdb.artworks.map((a) => {
        return {
          url: a.image!,
          image: a.image,
          width: a.width,
          height: a.height,
          language: a.language,
          thumbnail: a.thumbnail,
          type: getTypeNameById(a.type ?? 27).toLocaleLowerCase(),
          source: 'tvdb'
        };
      });

      await meta.addArtworks(id, artworks);
    }

    await Redis.set(key, tvdb);

    return tvdb;
  }
}

const tvdb = new Tvdb();

export default tvdb;
