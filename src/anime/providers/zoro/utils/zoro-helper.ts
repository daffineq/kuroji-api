import { Injectable } from '@nestjs/common';
import { Prisma, Zoro } from '@prisma/client';

@Injectable()
export class ZoroHelper {
  getZoroData(zoro: any): Prisma.ZoroCreateInput {
    return {
      id: zoro.id,
      title: zoro.title,
      malID: zoro.malID,
      alID: zoro.alID,
      japaneseTitle: zoro.japaneseTitle,
      image: zoro.image,
      description: zoro.description,
      type: zoro.type,
      url: zoro.url,
      subOrDub: zoro.subOrDub,
      hasSub: zoro.hasSub,
      hasDub: zoro.hasDub,
      status: zoro.status,
      season: zoro.season,
      totalEpisodes: zoro.totalEpisodes,
      episodes: {
        connectOrCreate: zoro.episodes.map((e: any) => ({
          where: { id: e.id },
          create: {
            id: e.id,
            number: e.number,
            title: e.title,
            isFiller: e.isFiller,
            isSubbed: e.isSubbed,
            isDubbed: e.isDubbed,
            url: e.url
          }
        })) ?? []
      },
    };
  }
}
