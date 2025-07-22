import { Injectable, NotFoundException } from '@nestjs/common';
import { TmdbSeasonEpisodeWithRelations } from '../types/types.js';
import { PrismaService } from '../../../../prisma.service.js';
import { TmdbService } from './tmdb.service.js';
import { TmdbSeasonService } from './tmdb.season.service.js';
import { tmdbFetch } from './tmdb.fetch.service.js';

@Injectable()
export class TmdbEpisodeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly season: TmdbSeasonService,
    private readonly tmdb: TmdbService,
  ) {}

  async getEpisodeDetails(
    epId: number,
  ): Promise<TmdbSeasonEpisodeWithRelations> {
    const include = {
      images: {
        include: {
          stills: {
            omit: {
              id: true,
              episodeImagesId: true,
            },
          },
        },
        omit: {
          episodeId: true,
        },
      },
    };

    const existingEpisode = (await this.prisma.tmdbSeasonEpisode.findUnique({
      where: { id: epId },
      include,
    })) as TmdbSeasonEpisodeWithRelations;

    if (!existingEpisode) {
      throw new Error('No episode found');
    }

    if (existingEpisode.images) {
      return existingEpisode;
    }

    const images = await tmdbFetch.fetchEpisodeImages(
      existingEpisode.show_id,
      existingEpisode.season_number,
      existingEpisode.episode_number,
    );
    images.episodeId = existingEpisode.id;
    await this.tmdb.saveImages(images);

    return (await this.prisma.tmdbSeasonEpisode.findUnique({
      where: { id: epId },
      include,
    })) as TmdbSeasonEpisodeWithRelations;
  }

  async getEpisodeDetailsByAnilist(
    id: number,
    ep: number,
  ): Promise<TmdbSeasonEpisodeWithRelations> {
    const season = await this.season.getTmdbSeasonByAnilist(id);
    const epId = season.episodes.find((e) => e.episode_number === ep)?.id;

    if (!epId) {
      throw new NotFoundException('Episode id not found');
    }

    return await this.getEpisodeDetails(epId);
  }
}
