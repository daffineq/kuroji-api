import { AnilistMedia } from './providers/anilist/types';
import { prisma, Prisma } from 'src/lib/prisma';
import { Anilist, Crysoline, Kitsu, MyAnimeList, Shikimori, Tmdb, TmdbSeasons, Tvdb } from './providers';
import { AnimePrisma } from './helpers/anime.prisma';
import { Meta } from './meta';
import { Module } from 'src/helpers/module';

class AnimeModule extends Module {
  override readonly name = 'Anime';

  async fetchOrCreate<T extends Prisma.AnimeDefaultArgs>(
    id: number,
    args?: Prisma.SelectSubset<T, Prisma.AnimeDefaultArgs>
  ): Promise<Prisma.AnimeGetPayload<T>> {
    const existing = await prisma.anime.findUnique({
      where: { id },
      ...(args as Prisma.AnimeDefaultArgs)
    });

    if (existing) {
      return existing as Prisma.AnimeGetPayload<T>;
    }

    const anilist = await Anilist.getInfo(id);

    return this.save(anilist, args);
  }

  async updateOrCreate<T extends Prisma.AnimeDefaultArgs>(
    id: number,
    args?: Prisma.SelectSubset<T, Prisma.AnimeDefaultArgs>
  ): Promise<Prisma.AnimeGetPayload<T>> {
    return this.update(id, args);
  }

  async update<T extends Prisma.AnimeDefaultArgs>(
    id: number,
    args?: Prisma.SelectSubset<T, Prisma.AnimeDefaultArgs>
  ): Promise<Prisma.AnimeGetPayload<T>> {
    const anilist = await Anilist.getInfo(id);

    return this.save(anilist, args);
  }

  async save<T extends Prisma.AnimeDefaultArgs>(
    anilist: AnilistMedia,
    args?: Prisma.SelectSubset<T, Prisma.AnimeDefaultArgs>
  ): Promise<Prisma.AnimeGetPayload<T>> {
    await AnimePrisma.upsert(anilist);

    await this.initProviders(anilist.id, anilist.idMal);

    return prisma.anime.findUnique({
      where: { id: anilist.id },
      ...(args as Prisma.AnimeDefaultArgs)
    }) as unknown as Promise<Prisma.AnimeGetPayload<T>>;
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
