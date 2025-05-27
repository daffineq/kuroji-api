import { Injectable } from '@nestjs/common';
import { Animepahe, AnimepaheEpisode, AnimepaheExternalLink } from '@prisma/client';
import { PrismaService } from '../../../../prisma.service';
import { findBestMatch } from '../../../../mapper/mapper.helper';
import { UpdateType } from '../../../../shared/UpdateType';
import { AnimePaheHelper } from '../utils/animepahe-helper';
import { ANIME, IAnimeResult, ISource } from '@consumet/extensions'

export interface AnimepaheWithRelations extends Animepahe {
  externalLinks: AnimepaheExternalLink[],
  episodes: AnimepaheEpisode[],
}

const animepahe = new ANIME.AnimePahe();

@Injectable()
export class AnimepaheService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly helper: AnimePaheHelper
  ) {}

  async getAnimepaheByAnilist(id: number): Promise<AnimepaheWithRelations> {
    const existingAnimepahe = await this.prisma.animepahe.findFirst({
      where: { alId: id },
      include: {
        externalLinks: true,
        episodes: true,
      }
    });

    if (existingAnimepahe) {
      return existingAnimepahe;
    }

    const animepahe = await this.findAnimepahe(id);
    return this.saveAnimepahe(animepahe as AnimepaheWithRelations);
  }

  async getSources(episodeId: string): Promise<ISource> {
    return await animepahe.fetchEpisodeSources(episodeId);
  }

  async saveAnimepahe(animepahe: Animepahe): Promise<AnimepaheWithRelations> {
    await this.prisma.lastUpdated.create({
      data: {
        entityId: animepahe.id,
        externalId: animepahe.alId,
        type: UpdateType.ANIMEPAHE,
      },
    });

    await this.prisma.animepahe.upsert({
      where: { id: animepahe.id },
      update: this.helper.getAnimePaheData(animepahe),
      create: this.helper.getAnimePaheData(animepahe),
    });

    return await this.prisma.animepahe.findFirst({
      where: { id: animepahe.id },
      include: {
        externalLinks: true,
        episodes: true,
      }
    }) as AnimepaheWithRelations;
  }

  async update(id: string): Promise<AnimepaheWithRelations> {
    const existingAnimepahe = await this.prisma.animepahe.findFirst({
      where: { id },
      include: { episodes: true }
    });

    const animepahe = await this.fetchAnimepahe(id) as AnimepaheWithRelations;

    if (!animepahe) {
      throw new Error('Animepahe not found');
    }
    
    animepahe.alId = existingAnimepahe?.alId || 0;

    return await this.saveAnimepahe(animepahe);
  }

  async fetchAnimepahe(id: string): Promise<Animepahe> {
    const info = await animepahe.fetchAnimeInfo(id);
    return info as unknown as Animepahe;
  }

  async searchAnimepahe(q: string): Promise<IAnimeResult[]> {
    return (await animepahe.search(q)).results;
  }
  
  async findAnimepahe(id: number): Promise<Animepahe> {
    const anilist = await this.prisma.anilist.findUnique({
      where: { id: id },
      select: {
        title: {
          select: {
            romaji: true,
            english: true,
            native: true,
          },
        },
        seasonYear: true,
        episodes: true,
      },
    });

    if (!anilist) {
      throw new Error('Anilist not found');
    }

    const searchResult = await this.searchAnimepahe(
      (anilist.title as { romaji: string }).romaji,
    );

    const results = searchResult.map(result => ({
      title: result.title,
      id: result.id,
      year: typeof result.releaseDate === 'string' ? parseInt(result.releaseDate) : result.releaseDate
    }));

    const searchCriteria = {
      title: {
        romaji: anilist.title?.romaji || undefined,
        english: anilist.title?.english || undefined,
        native: anilist.title?.native || undefined,
      },
      year: anilist.seasonYear ?? undefined,
      episodes: anilist.episodes ?? undefined
    };

    const bestMatch = findBestMatch(searchCriteria, results);

    if (bestMatch) {
      const data = await this.fetchAnimepahe(bestMatch.result.id as string);
      data.alId = id;
      return data;
    }

    throw new Error('Animepahe not found');
  }
}
