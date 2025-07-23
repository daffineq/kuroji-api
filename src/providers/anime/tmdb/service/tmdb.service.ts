import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, TmdbSeason } from '@prisma/client';
import { PrismaService } from '../../../../prisma.service.js';
import { findBestMatch, ExpectAnime } from '../../../mapper/mapper.helper.js';
import { AnilistService } from '../../anilist/service/anilist.service.js';
import { TmdbHelper } from '../utils/tmdb-helper.js';
import { sleep } from '../../../../utils/utils.js';
import {
  TmdbWithRelations,
  TmdbSeasonWithRelations,
  TmdbSeasonEpisodeImagesWithRelations,
  BasicTmdb,
  TmdbDetailsMerged,
} from '../types/types.js';
import { Client } from '../../../model/client.js';
import { UrlConfig } from '../../../../configs/url.config.js';
import { MappingsService } from '../../mappings/service/mappings.service.js';
import { tmdbFetch } from './tmdb.fetch.service.js';
import { findBestMatchFromSearch } from '../utils/utils.js';
import { deepCleanTitle } from '../../../mapper/mapper.cleaning.js';
import { fullSelect } from '../../anilist/types/types.js';
import { AniZipPayload } from '../../mappings/types/types.js';

@Injectable()
export class TmdbService extends Client {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mappings: MappingsService,
    private readonly anilist: AnilistService,
    private readonly helper: TmdbHelper,
  ) {
    super(UrlConfig.TMDB);
  }

  // Core TMDB Methods
  async getInfo<T extends Prisma.TmdbSelect>(
    id: number,
    select?: T,
  ): Promise<Prisma.TmdbGetPayload<{ select: T }>> {
    const existingTmdb = await this.prisma.tmdb.findUnique({
      where: { id },
      select,
    });

    if (existingTmdb) {
      return existingTmdb as Prisma.TmdbGetPayload<{ select: T }>;
    }

    const type = await this.detectType(id);
    const tmdb = await tmdbFetch.fetchInfo(id, type);

    return await this.save(tmdb);
  }

  async getInfoByAnilist<T extends Prisma.TmdbSelect>(
    id: number,
    select?: T,
  ): Promise<Prisma.TmdbGetPayload<{ select: T }>> {
    const anilist = await this.anilist.getAnilist(id, fullSelect);
    if (!anilist) throw new NotFoundException('Anilist not found');

    const mapping = anilist.anizip as AniZipPayload;
    if (!mapping) throw new NotFoundException('No mappings found');

    const tmdbId = mapping.mappings?.themoviedbId;
    const type = mapping.mappings?.type?.toLowerCase();
    if (!type) throw new NotFoundException('No type found');

    if (!tmdbId) {
      const tmdb = await this.findTmdb(id);
      await this.mappings.updateAniZipMappings(mapping.id, {
        themoviedbId: tmdb.id,
      });
      return this.findTmdb(id, select);
    }

    const existing = await this.prisma.tmdb.findUnique({
      where: { id: tmdbId },
      select,
    });

    if (existing) return existing as Prisma.TmdbGetPayload<{ select: T }>;

    const tmdb = await tmdbFetch.fetchInfo(tmdbId, type);
    return await this.save(tmdb, select);
  }

  // Data Fetching Methods
  async fetchByAnilist<T extends Prisma.TmdbSelect>(
    id: number,
    select?: T,
  ): Promise<Prisma.TmdbGetPayload<{ select: T }>> {
    const anilist = await this.anilist.getAnilist(id, fullSelect);
    const possibleTitles = [
      anilist.title?.native,
      anilist.title?.romaji,
      anilist.title?.english,
    ].filter(Boolean) as string[];

    if (possibleTitles.length === 0)
      throw new NotFoundException('No title found in AniList');

    let bestMatch: BasicTmdb | null = null;

    for (const title of possibleTitles) {
      const searchResults = await tmdbFetch.search(deepCleanTitle(title));
      bestMatch = findBestMatchFromSearch(anilist, searchResults);
      if (bestMatch) break;
    }

    if (!bestMatch) throw new NotFoundException('No matching TMDb entry found');

    const fetchedTmdb = await tmdbFetch.fetchInfo(
      bestMatch.id,
      bestMatch.media_type,
    );
    fetchedTmdb.media_type = bestMatch.media_type;

    return this.save(fetchedTmdb, select);
  }

  // Database Operations
  async save<T extends Prisma.TmdbSelect>(
    tmdb: TmdbDetailsMerged,
    select?: T,
  ): Promise<Prisma.TmdbGetPayload<{ select: T }>> {
    return (await this.prisma.tmdb.upsert({
      where: { id: tmdb.id },
      update: this.helper.getTmdbData(tmdb),
      create: this.helper.getTmdbData(tmdb),
      select,
    })) as Prisma.TmdbGetPayload<{ select: T }>;
  }

  async saveSeason<T extends Prisma.TmdbSeasonSelect>(
    tmdbSeason: TmdbSeasonWithRelations,
    select?: T,
  ): Promise<Prisma.TmdbSeasonGetPayload<{ select: T }>> {
    return (await this.prisma.tmdbSeason.upsert({
      where: { id: tmdbSeason.id },
      update: this.helper.getTmdbSeasonData(tmdbSeason),
      create: this.helper.getTmdbSeasonData(tmdbSeason),
      select,
    })) as Prisma.TmdbSeasonGetPayload<{ select: T }>;
  }

  async saveImages<T extends Prisma.TmdbSeasonEpisodeImagesSelect>(
    images: TmdbSeasonEpisodeImagesWithRelations,
    select?: T,
  ): Promise<Prisma.TmdbSeasonEpisodeImagesGetPayload<{ select: T }>> {
    return (await this.prisma.tmdbSeasonEpisodeImages.create({
      data: this.helper.getTmdbEpisodeImagesData(images),
      select,
    })) as Prisma.TmdbSeasonEpisodeImagesGetPayload<{ select: T }>;
  }

  // Update Methods
  async update<T extends Prisma.TmdbSelect>(
    id: number,
    select?: T,
  ): Promise<Prisma.TmdbGetPayload<{ select: T }>> {
    const existingTmdb = await this.getInfoByAnilist(id);
    const tmdb = await tmdbFetch.fetchInfo(
      existingTmdb.id,
      existingTmdb.media_type ?? 'tv',
    );
    const savedTmdb = await this.save(tmdb, select);
    await this.updateSeason(id);
    return savedTmdb;
  }

  async updateSeason(id: number): Promise<TmdbWithRelations> {
    const tmdb = (await this.prisma.tmdb.findFirst({
      where: { id },
      include: {
        seasons: true,
      },
    })) as TmdbWithRelations;

    if (!tmdb) throw new NotFoundException(`TMDb ID ${id} not found`);

    for (const season of tmdb.seasons) {
      console.log(
        `Updating TMDB season: ${season.season_number} for tmdb: ${tmdb.id}`,
      );

      const tmdbSeason = await tmdbFetch.fetchSeasonInfo(
        id,
        season.season_number || 1,
      );
      tmdbSeason.show_id = tmdb.id;
      await this.saveSeason(tmdbSeason);

      await sleep(15, false);
    }

    return tmdb;
  }

  // Matching Methods
  async findTmdb<T extends Prisma.TmdbSelect>(
    id: number,
    select?: T,
  ): Promise<Prisma.TmdbGetPayload<{ select: T }>> {
    const tmdb = await this.findMatchInPrisma(id, select).catch(() => null);
    if (tmdb) return tmdb;
    return await this.fetchByAnilist(id);
  }

  async findMatchInPrisma<T extends Prisma.TmdbSelect>(
    id: number,
    select?: T,
  ): Promise<Prisma.TmdbGetPayload<{ select: T }>> {
    const anilist = await this.anilist.getAnilist(id);
    const titles = [
      anilist.title?.native,
      anilist.title?.romaji,
      anilist.title?.english,
    ].filter(Boolean) as string[];

    const candidates = await this.prisma.tmdb.findMany({
      where: {
        OR: titles.flatMap((t) => [
          { name: { contains: deepCleanTitle(t), mode: 'insensitive' } },
          {
            original_name: { contains: deepCleanTitle(t), mode: 'insensitive' },
          },
        ]),
      },
      select,
      take: 25,
    });

    const searchAnime: ExpectAnime = {
      titles: [
        anilist.title?.native,
        anilist.title?.romaji,
        anilist.title?.english,
        ...anilist.synonyms,
      ],
    };

    const bestMatch = findBestMatch(
      searchAnime,
      candidates.map((result) => ({
        id: result.id,
        titles: [result.name, result.original_name],
      })),
    );

    if (!bestMatch) throw new NotFoundException('No matching TMDb entry found');

    return candidates.find(
      (c) => c.id === bestMatch.result.id,
    )! as Prisma.TmdbGetPayload<{ select: T }>;
  }

  async detectType(id: number): Promise<string> {
    try {
      await tmdbFetch.fetchInfo(id, 'tv');
      return 'tv';
    } catch (_) {
      try {
        await tmdbFetch.fetchInfo(id, 'movie');
        return 'movie';
      } catch (_) {
        throw new NotFoundException('ID not found in TVDB as Movie or Series.');
      }
    }
  }
}
