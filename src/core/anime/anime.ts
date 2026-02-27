import { AnilistMedia } from './providers/anilist/types';
import { Anilist, AnilistUtils, Crysoline, Kitsu, MyAnimeList, Shikimori, Tmdb, Tvdb } from './providers';
import { AnimeDb } from './helpers/anime.db';
import { Module } from 'src/helpers/module';
import { animeLink, animeToImage, animeToLink, db } from 'src/db';
import { AnimeFetch } from './helpers/anime.fetch';
import { AnimeUtils } from './helpers';
import { AnimePayload } from './types';
import { eq } from 'drizzle-orm';

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

    return this.save(AnilistUtils.anilistToAnimePayload(anilist));
  }

  async updateOrCreate(id: number) {
    return this.update(id);
  }

  async update(id: number) {
    const anilist = await Anilist.getInfo(id);

    return this.save(AnilistUtils.anilistToAnimePayload(anilist));
  }

  async save(payload: AnimePayload) {
    await AnimeDb.upsert(payload);

    await this.initProviders(payload.id, payload.id_mal ?? undefined);

    return db.query.anime.findFirst({
      where: {
        id: payload.id
      }
    });
  }

  async upsert(payload: AnimePayload) {
    await AnimeDb.upsert(payload);

    return db.query.anime.findFirst({
      where: {
        id: payload.id
      }
    });
  }

  async initProviders(id: number, idMal?: number | undefined) {
    await this.loadMappings(id);

    await Promise.all([
      Crysoline.map(id).catch(() => null),
      MyAnimeList.getInfo(id, idMal).catch(() => null),
      Shikimori.getInfo(id, idMal).catch(() => null),
      Kitsu.getInfo(id).catch(() => null),
      Tmdb.getInfo(id).catch(() => null)
    ]);

    await Promise.all([Tvdb.getInfo(id).catch(() => null)]);
  }

  async loadMappings(id: number) {
    await this.fetchOrCreate(id);
    const fetched = await AnimeFetch.fetchMappings(id).catch(() => null);
    const links = AnimeUtils.toLinksArray(fetched?.mappings);
    await this.upsert({ id, links });
  }

  async map(id: number, name: string) {
    const links = await db
      .select({ link: animeLink })
      .from(animeToLink)
      .leftJoin(animeLink, eq(animeToLink.B, animeLink.id))
      .where(eq(animeToImage.A, id));

    return links.find((l) => l.link?.source_name.toLowerCase() === name.toLowerCase())?.link?.source_link ?? null;
  }
}

const Anime = new AnimeModule();

export { Anime, AnimeModule };
