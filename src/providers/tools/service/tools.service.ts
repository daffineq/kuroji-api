import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { UpdateType } from '../../update/UpdateType';
import { getUpdateData } from '../../update/update.util';
import { sleep } from '../../../utils/utils';

@Injectable()
export class ToolsService {
  constructor(private readonly prisma: PrismaService) {}

  async fixUpdatesForAnilist() {
    return this.fixUpdates(
      UpdateType.ANILIST,
      () => this.prisma.anilist.findMany({ select: { id: true } }),
      (anime) => getUpdateData(String(anime.id), anime.id, UpdateType.ANILIST),
    );
  }

  async fixUpdatesForShikimori() {
    return this.fixUpdates(
      UpdateType.SHIKIMORI,
      () =>
        this.prisma.shikimori.findMany({
          select: { id: true, malId: true },
        }),
      (anime) =>
        getUpdateData(anime.id, anime.malId ?? undefined, UpdateType.SHIKIMORI),
    );
  }

  async fixUpdatesForKitsu() {
    return this.fixUpdates(
      UpdateType.KITSU,
      () =>
        this.prisma.kitsu.findMany({
          select: { id: true, anilistId: true },
        }),
      (anime) =>
        getUpdateData(anime.id, anime.anilistId ?? undefined, UpdateType.KITSU),
    );
  }

  async fixUpdatesForAnimepahe() {
    return this.fixUpdates(
      UpdateType.ANIMEPAHE,
      () =>
        this.prisma.animepahe.findMany({
          select: { id: true, alId: true },
        }),
      (anime) =>
        getUpdateData(anime.id, anime.alId ?? undefined, UpdateType.ANIMEPAHE),
    );
  }

  async fixUpdatesForAnimekai() {
    return this.fixUpdates(
      UpdateType.ANIMEKAI,
      () =>
        this.prisma.animeKai.findMany({
          select: { id: true, anilistId: true },
        }),
      (anime) =>
        getUpdateData(
          anime.id,
          anime.anilistId ?? undefined,
          UpdateType.ANIMEKAI,
        ),
    );
  }

  async fixUpdatesForZoro() {
    return this.fixUpdates(
      UpdateType.ANIWATCH,
      () =>
        this.prisma.zoro.findMany({
          select: { id: true, alID: true },
        }),
      (anime) =>
        getUpdateData(anime.id, anime.alID ?? undefined, UpdateType.ANIWATCH),
    );
  }

  async fixUpdatesForTMDB() {
    return this.fixUpdates(
      UpdateType.TMDB,
      () =>
        this.prisma.tmdb.findMany({
          select: { id: true },
        }),
      (anime) =>
        getUpdateData(String(anime.id), anime.id ?? undefined, UpdateType.TMDB),
    );
  }

  async fixUpdatesForTVDB() {
    return this.fixUpdates(
      UpdateType.TVDB,
      () =>
        this.prisma.tvdb.findMany({
          select: { id: true },
        }),
      (anime) =>
        getUpdateData(String(anime.id), anime.id ?? undefined, UpdateType.TVDB),
    );
  }

  private async fixUpdates<T>(
    type: UpdateType,
    getData: () => Promise<T[]>,
    mapFn: (entry: T) => ReturnType<typeof getUpdateData>,
  ) {
    const data = await getData();

    await this.prisma.lastUpdated.deleteMany({ where: { type } });

    const BATCH_SIZE = 500;
    const updateData = data.map(mapFn);

    for (let i = 0; i < updateData.length; i += BATCH_SIZE) {
      const batch = updateData.slice(i, i + BATCH_SIZE);
      await this.prisma.lastUpdated.createMany({
        data: batch,
        skipDuplicates: true,
      });
      console.log(`Fixing ${i + 1} batch for provider ${type}`);
      await sleep(1, false);
    }

    console.log(`Fixing ${type} finished`);
  }
}
