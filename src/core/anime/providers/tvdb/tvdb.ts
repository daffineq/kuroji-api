import { NotFoundError } from 'src/helpers/errors';
import { TvdbInfoResult } from './types';
import { getKey, Redis } from 'src/helpers/redis.util';
import { parseString } from 'src/helpers/parsers';
import { ArtworkEntry, unifyArtworkType } from '../../meta/helpers/meta.dto';
import { Anilist } from '../anilist';
import { TvdbUtils } from './helpers/tvdb.utils';
import { TvdbFetch } from './helpers/tvdb.fetch';
import { Meta } from '../../meta';
import { normalize_iso_639_1 } from 'src/helpers/languages';
import { ProviderModule } from 'src/helpers/module';

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

    const type = TvdbUtils.getTvdbTypeByAl(al.format);

    const meta = await Meta.fetchOrCreate(id);

    const tvdbId = meta?.mappings.find((m) => m.source_name === 'tvdb')?.source_id;
    const tmdbId = meta?.mappings.find((m) => m.source_name === 'tmdb')?.source_id;

    let tvdb: TvdbInfoResult | undefined = undefined;

    if (tvdbId) {
      tvdb = type === 'movie' ? await TvdbFetch.fetchMovie(tvdbId) : await TvdbFetch.fetchSeries(tvdbId);
    } else if (tmdbId) {
      const search = await TvdbFetch.searchByRemote(
        tmdbId,
        type,
        al.title.romaji ?? al.title.native ?? al.title.english ?? ''
      );

      tvdb = type === 'movie' ? await TvdbFetch.fetchMovie(search.id) : await TvdbFetch.fetchSeries(search.id);

      await Meta.update({
        id,
        mappings: {
          id: parseString(tvdb.id)!,
          name: this.name
        }
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
          type: unifyArtworkType(a.type),
          source: this.name
        };
      });

      await Meta.update({ id, artworks });
    }

    await Redis.set(key, tvdb);

    return tvdb;
  }
}

const Tvdb = new TvdbModule();

export { Tvdb, TvdbModule };
