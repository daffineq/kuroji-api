import { AnilistMedia } from './providers/anilist/types';
import { Anilist, Crysoline, Kitsu, MyAnimeList, Shikimori, Tmdb, Tvdb } from './providers';
import { AnimeDb } from './helpers/anime.db';
import { Meta } from './meta';
import { Module } from 'src/helpers/module';
import { db } from 'src/db';

class AnimeModule extends Module {
  override readonly name = 'Anime';

  async fetchOrCreate(id: number) {
    const existing = await db.query.anime.findFirst({
      where: {
        id
      }
    });

    if (existing) {
      return existing;
    }

    const anilist = await Anilist.getInfo(id);

    return this.save(anilist);
  }

  async updateOrCreate(id: number) {
    return this.update(id);
  }

  async update(id: number) {
    const anilist = await Anilist.getInfo(id);

    return this.save(anilist);
  }

  async save(anilist: AnilistMedia) {
    await AnimeDb.upsert(anilist);

    await this.initProviders(anilist.id, anilist.idMal);

    return db.query.anime.findFirst({
      where: {
        id: anilist.id
      }
    });
  }

  async initProviders(id: number, idMal: number | undefined) {
    await Meta.loadMappings(id);

    await Promise.all([
      Crysoline.map(id).catch(() => null),
      MyAnimeList.getInfo(id, idMal).catch(() => null),
      Shikimori.getInfo(id, idMal).catch(() => null),
      Kitsu.getInfo(id).catch(() => null),
      Tmdb.getInfo(id).catch(() => null)
    ]);

    await Promise.all([Tvdb.getInfo(id).catch(() => null)]);
  }
}

const Anime = new AnimeModule();

export { Anime, AnimeModule };
