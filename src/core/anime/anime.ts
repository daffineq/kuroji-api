import { AnilistMedia } from './providers/anilist/types';
import { prisma, Prisma } from 'src/lib/prisma';
import { Anilist, Kitsu, MyAnimeList, Shikimori, Tmdb, TmdbSeasons, Tvdb } from './providers';
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

    const al = await Anilist.getInfo(id);

    return this.save(al, args);
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
    const al = await Anilist.getInfo(id);

    return this.save(al, args);
  }

  async save<T extends Prisma.AnimeDefaultArgs>(
    al: AnilistMedia,
    args?: Prisma.SelectSubset<T, Prisma.AnimeDefaultArgs>
  ): Promise<Prisma.AnimeGetPayload<T>> {
    await prisma.anime.upsert({
      where: { id: al.id },
      update: await AnimePrisma.getAnime(al),
      create: await AnimePrisma.getAnime(al)
    });

    await this.initProviders(al.id, al.idMal);

    return prisma.anime.findUnique({
      where: { id: al.id },
      ...(args as Prisma.AnimeDefaultArgs)
    }) as unknown as Promise<Prisma.AnimeGetPayload<T>>;
  }

  async initProviders(id: number, idMal: number | undefined) {
    await Meta.loadMappings(id);

    await Promise.all([
      MyAnimeList.getInfo(id, idMal).catch(() => null),
      Shikimori.getInfo(id, idMal).catch(() => null),
      Kitsu.getInfo(id).catch(() => null),
      Tmdb.getInfo(id).catch(() => null),
      Tvdb.getInfo(id).catch(() => null)
    ]);

    await TmdbSeasons.getSeason(id).catch(() => null);
  }
}

const Anime = new AnimeModule();

export { Anime, AnimeModule };
