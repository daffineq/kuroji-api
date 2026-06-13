import { Kitsu, MyAnimeList, Shikimori, Tmdb, TmdbSeasons, Tvdb, Zerochan } from './providers';
import { Anilist, AnilistUtils, MediaDb } from '../media';
import { Module } from 'src/helpers/module';
import { db } from 'src/db';
import { MediaPayload } from '../media';

class AnimeModule extends Module {
  override readonly name = 'Anime';

  async update(id: number) {
    const anilist = await Anilist.getInfo(id);

    await this.saveAndInit(AnilistUtils.anilistToMediaPayload(anilist));
  }

  async saveAndInit(payload: MediaPayload) {
    await MediaDb.upsert(payload);

    await this.initProviders(payload.id, payload.id_mal ?? undefined);
  }

  async initProviders(id: number, idMal?: number | undefined) {
    await Promise.all([
      MyAnimeList.getInfo(id, idMal).catch(() => null),
      Shikimori.getInfo(id, idMal).catch(() => null),
      Kitsu.getInfo(id).catch(() => null),
      Tmdb.getInfo(id).catch(() => null),
      Tvdb.getInfo(id).catch(() => null),
      Zerochan.getImages(id).catch(() => null)
    ]);

    await TmdbSeasons.getEpisodes(id).catch(() => null);
  }

  async getBasicInfo(id: number) {
    return db.query.media.findFirst({
      where: {
        id
      },
      with: {
        title: true,
        airing_schedule: true,
        alt_titles: true,
        start_date: true,
        end_date: true
      }
    });
  }
}

const Anime = new AnimeModule();

export { Anime, AnimeModule };
