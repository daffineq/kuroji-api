import {
  Anilist,
  AnilistUtils,
  Kitsu,
  MyAnimeList,
  Shikimori,
  Tmdb,
  TmdbSeasons,
  Tvdb,
  Zerochan
} from './providers';
import { AnimeDb } from './helpers/anime.db';
import { Module } from 'src/helpers/module';
import { anime, animeLink, animeToLink, db } from 'src/db';
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

    await this.saveAndInit(AnilistUtils.anilistToAnimePayload(anilist));

    return db.query.anime.findFirst({
      where: {
        id
      }
    });
  }

  async create(id: number) {
    const anilist = await Anilist.getInfo(id);

    await this.saveAndInit(AnilistUtils.anilistToAnimePayload(anilist));
  }

  async update(id: number) {
    const anilist = await Anilist.getInfo(id);

    await this.saveAndInit(AnilistUtils.anilistToAnimePayload(anilist));
  }

  async save(payload: AnimePayload) {
    await AnimeDb.upsert(payload);
  }

  async saveAndInit(payload: AnimePayload) {
    await AnimeDb.upsert(payload);

    await this.initProviders(payload.id, payload.id_mal ?? undefined);
  }

  async initProviders(id: number, idMal?: number | undefined) {
    await Promise.all([
      MyAnimeList.getInfo(id, idMal).catch(() => null),
      Shikimori.getInfo(id, idMal).catch(() => null),
      Kitsu.getInfo(id).catch(() => null),
      Tmdb.getInfo(id).catch(() => null),
      Zerochan.getImages(id).catch(() => null)
    ]);

    await Promise.all([Tvdb.getInfo(id).catch(() => null), TmdbSeasons.getEpisodes(id).catch(() => null)]);
  }

  async map(id: number, name: string) {
    const links = await db
      .select({ link: animeLink })
      .from(animeToLink)
      .innerJoin(animeLink, eq(animeLink.id, animeToLink.B))
      .where(eq(animeToLink.A, id));

    return links.find((l) => l.link?.label.toLowerCase() === name.toLowerCase())?.link?.link ?? null;
  }

  async shouldAutoUpdate(id: number) {
    const result = await db
      .select({ auto_update: anime.auto_update })
      .from(anime)
      .where(eq(anime.id, id))
      .limit(1);

    return result[0]?.auto_update ?? true;
  }

  async exists(id: number) {
    const result = await db.select({ id: anime.id }).from(anime).where(eq(anime.id, id)).limit(1);

    return result.length > 0;
  }
}

const Anime = new AnimeModule();

export { Anime, AnimeModule };
