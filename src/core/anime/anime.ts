import { Prisma } from '@prisma/client';
import { AnilistMedia } from './providers/anilist/types';
import prisma from 'src/lib/prisma';
import { MetaInfo } from 'src/helpers/response';
import { BadRequestError } from 'src/helpers/errors';
import { Anilist, Mal, Shikimori, Tmdb, TmdbSeasons, Tvdb } from './providers';
import { AnimePrisma } from './helpers/anime.prisma';
import { Meta } from './meta';

const fetchOrCreate = async <T extends Prisma.AnimeDefaultArgs>(
  id: number,
  args?: Prisma.SelectSubset<T, Prisma.AnimeDefaultArgs>
): Promise<Prisma.AnimeGetPayload<T>> => {
  const existing = await prisma.anime.findUnique({
    where: { id },
    ...(args as Prisma.AnimeDefaultArgs)
  });

  if (existing) {
    return existing as Prisma.AnimeGetPayload<T>;
  }

  const al = await Anilist.getInfo(id);

  return save(al, args);
};

const update = async <T extends Prisma.AnimeDefaultArgs>(
  id: number,
  args?: Prisma.SelectSubset<T, Prisma.AnimeDefaultArgs>
): Promise<Prisma.AnimeGetPayload<T>> => {
  const al = await Anilist.getInfo(id);

  return save(al, args);
};

const many = async <T extends Prisma.AnimeFindManyArgs>(
  find?: T
): Promise<{ meta: MetaInfo; data: Prisma.AnimeGetPayload<T>[] }> => {
  if (find?.take && find.take > 50) {
    throw new BadRequestError('Nawwww, Maximum take is 50');
  }

  const [total, data] = await Promise.all([
    prisma.anime.count({ where: find?.where }),
    prisma.anime.findMany(find)
  ]);

  const page = find?.skip ? Math.floor(find.skip / (find.take ?? 1)) + 1 : 1;
  const perPage = find?.take || 1;

  return {
    meta: { total, page, perPage, hasNextPage: total > page * perPage },
    data: data as Prisma.AnimeGetPayload<T>[]
  };
};

const first = async <T extends Prisma.AnimeFindFirstArgs>(find?: T) => {
  return prisma.anime.findFirst(find);
};

const save = async <T extends Prisma.AnimeDefaultArgs>(
  al: AnilistMedia,
  args?: Prisma.SelectSubset<T, Prisma.AnimeDefaultArgs>
): Promise<Prisma.AnimeGetPayload<T>> => {
  await prisma.anime.upsert({
    where: { id: al.id },
    update: await AnimePrisma.getAnime(al),
    create: await AnimePrisma.getAnime(al)
  });

  await initProviders(al.id, al.idMal);

  return prisma.anime.findUnique({
    where: { id: al.id },
    ...(args as Prisma.AnimeDefaultArgs)
  }) as unknown as Promise<Prisma.AnimeGetPayload<T>>;
};

const initProviders = async (id: number, idMal: number | undefined) => {
  await Meta.loadMappings(id);

  await Promise.all([
    Mal.getInfo(id, idMal).catch(() => null),
    Shikimori.getInfo(id, idMal).catch(() => null),
    Tmdb.getInfo(id).catch(() => null),
    Tvdb.getInfo(id).catch(() => null)
  ]);

  await TmdbSeasons.getSeason(id).catch(() => null);
};

const Anime = {
  fetchOrCreate,
  many,
  first,
  update,
  save
};

export { Anime };
