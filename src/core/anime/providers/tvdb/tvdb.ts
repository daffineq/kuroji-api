import { NotFoundError } from 'src/helpers/errors';
import { getTypeNameById, TvdbInfoResult } from './types';
import { getKey, Redis } from 'src/helpers/redis.util';
import { parseString } from 'src/helpers/parsers';
import { metaSelect } from '../../meta/types';
import { ArtworkEntry } from '../../meta/helpers/meta.dto';
import { Anilist } from '../anilist';
import { TvdbUtils } from './helpers/tvdb.utils';
import { TvdbFetch } from './helpers/tvdb.fetch';
import { Meta } from '../../meta';
import { normalize_iso_639_1 } from 'src/helpers/languages';
import { ProviderModule } from 'src/helpers/module';

class TvdbModule extends ProviderModule<TvdbInfoResult> {
  override readonly name = 'TVDB';

  override async getInfo(id: number): Promise<TvdbInfoResult> {
    const key = getKey('tvdb', 'info', id);

    const cached = await Redis.get<TvdbInfoResult>(key);

    if (cached) {
      return cached;
    }

    const al = await Anilist.getInfo(id);

    if (!al) {
      throw new NotFoundError('Anilist not found');
    }

    const type = TvdbUtils.getTvdbTypeByAl(al.format);

    const meta = await Meta.fetchOrCreate(id, metaSelect);

    const tvdbId = meta.mappings.find((m) => m.source_name === 'tvdb')?.source_id;
    const tmdbId = meta.mappings.find((m) => m.source_name === 'tmdb')?.source_id;

    var tvdb: TvdbInfoResult | undefined = undefined;

    if (tvdbId) {
      tvdb = type === 'movie' ? await TvdbFetch.fetchMovie(tvdbId) : await TvdbFetch.fetchSeries(tvdbId);
    } else if (tmdbId) {
      const search = await TvdbFetch.searchByRemote(
        tmdbId,
        type,
        al.title.romaji ?? al.title.native ?? al.title.english ?? ''
      );

      tvdb = type === 'movie' ? await TvdbFetch.fetchMovie(search.id) : await TvdbFetch.fetchSeries(search.id);

      await Meta.addSingleMapping(id, {
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
          iso_639_1: normalize_iso_639_1(a.language) ?? undefined,
          thumbnail: a.thumbnail,
          type: getTypeNameById(a.type ?? 27).toLocaleLowerCase(),
          source: 'tvdb'
        };
      });

      await Meta.addArtworks(id, artworks);
    }

    await Redis.set(key, tvdb);

    return tvdb;
  }
}

const Tvdb = new TvdbModule();

export { Tvdb, TvdbModule };
