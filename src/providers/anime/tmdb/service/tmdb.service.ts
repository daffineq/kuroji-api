import { Injectable } from '@nestjs/common';
import { TmdbSeason } from '@prisma/client';
import { TMDB } from '../../../../configs/tmdb.config.js';
import { PrismaService } from '../../../../prisma.service.js';
import {
  findBestMatch,
  ExpectAnime,
  deepCleanTitle,
} from '../../../mapper/mapper.helper.js';
import { AnilistService } from '../../anilist/service/anilist.service.js';
import {
  filterSeasonEpisodes,
  findBestMatchFromSearch,
  getTmdbInclude,
  TmdbHelper,
} from '../utils/tmdb-helper.js';
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
  async getTmdb(id: number): Promise<TmdbWithRelations> {
    const existingTmdb = (await this.prisma.tmdb.findUnique({
      where: { id },
      include: getTmdbInclude(),
    })) as TmdbWithRelations;

    if (existingTmdb) return existingTmdb;

    const type = await this.detectType(id);
    const tmdb = await this.fetchTmdb(id, type);

    return await this.saveTmdb(tmdb);
  }

  async getTmdbByAnilist(id: number): Promise<TmdbWithRelations> {
    const anilist = await this.anilist.getAnilist(id);
    const mapping = anilist.anizip;

    if (!mapping) {
      throw new Error('No mappings found');
    }

    const tmdbId = mapping.mappings?.themoviedbId;
    const type = mapping.mappings?.type?.toLowerCase();

    if (!type) {
      throw new Error('No type found');
    }

    if (!tmdbId) {
      const tmdb = await this.findTmdb(id);
      await this.mappings.updateAniZipMappings(mapping.id, {
        themoviedbId: tmdb.id,
      });
      return await this.findTmdb(id);
    }

    const existing = (await this.prisma.tmdb.findUnique({
      where: { id: tmdbId },
      include: getTmdbInclude(),
    })) as TmdbWithRelations;

    if (existing) return existing;

    const tmdb = await this.fetchTmdb(tmdbId, type);

    return await this.saveTmdb(tmdb);
  }

  // Data Fetching Methods
  async fetchTmdb(id: number, type: string): Promise<TmdbDetailsMerged> {
    const url =
      type === 'tv' ? TMDB.getTvDetails(id) : TMDB.getMovieDetails(id);
    const { data, error } = await this.client.get<TmdbDetailsMerged>(url);

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Data is null');
    }

    return data;
  }

  async fetchTmdbSeason(
    id: number,
    seasonNumber: number,
  ): Promise<TmdbSeasonWithRelations> {
    const { data, error } = await this.client.get<TmdbSeasonWithRelations>(
      TMDB.getSeasonDetails(id, seasonNumber),
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Data is null');
    }

    return filterSeasonEpisodes(data);
  }

  async fetchTmdbByAnilist(id: number): Promise<TmdbWithRelations> {
    const anilist = await this.anilist.getAnilist(id);
    const possibleTitles = [
      anilist.title?.native,
      anilist.title?.romaji,
      anilist.title?.english,
    ].filter(Boolean) as string[];

    if (possibleTitles.length === 0) {
      throw new Error('No title found in AniList');
    }

    let bestMatch: BasicTmdb | null = null;

    for (const title of possibleTitles) {
      const searchResults = await this.searchTmdb(deepCleanTitle(title));
      bestMatch = findBestMatchFromSearch(anilist, searchResults);
      if (bestMatch) break;
    }

    if (!bestMatch) {
      throw new Error('No matching TMDb entry found');
    }

    const fetchedTmdb = await this.fetchTmdb(
      bestMatch.id,
      bestMatch.media_type,
    );
    fetchedTmdb.media_type = bestMatch.media_type;

    return this.saveTmdb(fetchedTmdb);
  }

  async searchTmdb(query: string): Promise<BasicTmdb[]> {
    const { data, error } = await this.client.get<BasicTmdb[]>(
      TMDB.multiSearch(query),
      {
        jsonPath: 'results',
      },
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Data is null');
    }

    return data;
  }

  async fetchEpisodeImages(
    tvId: number,
    seasonNumber: number,
    episode: number,
  ): Promise<TmdbSeasonEpisodeImagesWithRelations> {
    const { data, error } =
      await this.client.get<TmdbSeasonEpisodeImagesWithRelations>(
        TMDB.getEpisodeImages(tvId, seasonNumber, episode),
      );

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Data is null');
    }

    return data;
  }

  // Database Operations
  async saveTmdb(tmdb: TmdbDetailsMerged): Promise<TmdbWithRelations> {
    return (await this.prisma.tmdb.upsert({
      where: { id: tmdb.id },
      update: this.helper.getTmdbData(tmdb),
      create: this.helper.getTmdbData(tmdb),
      include: getTmdbInclude(),
    })) as TmdbWithRelations;
  }

  async saveTmdbSeason(
    tmdbSeason: TmdbSeasonWithRelations,
  ): Promise<TmdbSeason> {
    return this.prisma.tmdbSeason.upsert({
      where: { id: tmdbSeason.id },
      update: this.helper.getTmdbSeasonData(tmdbSeason),
      create: this.helper.getTmdbSeasonData(tmdbSeason),
      include: {
        episodes: true,
      },
    });
  }

  async saveImages(
    images: TmdbSeasonEpisodeImagesWithRelations,
  ): Promise<TmdbSeasonEpisodeImagesWithRelations> {
    return this.prisma.tmdbSeasonEpisodeImages.create({
      data: this.helper.getTmdbEpisodeImagesData(images),
      include: {
        stills: true,
      },
    });
  }

  // Update Methods
  async update(id: number): Promise<TmdbWithRelations> {
    const existingTmdb = await this.getTmdb(id);
    const tmdb = await this.fetchTmdb(id, existingTmdb.media_type ?? 'tv');
    const savedTmdb = await this.saveTmdb(tmdb);
    await this.updateSeason(id);
    return savedTmdb;
  }

  async updateByAnilist(id: number) {
    const tmdb = await this.getTmdbByAnilist(id);
    return await this.update(tmdb.id);
  }

  async updateSeason(id: number): Promise<TmdbWithRelations> {
    const tmdb = (await this.prisma.tmdb.findFirst({
      where: { id },
      include: {
        seasons: true,
      },
    })) as TmdbWithRelations;

    if (!tmdb) {
      throw new Error(`TMDb ID ${id} not found`);
    }

    for (const season of tmdb.seasons) {
      console.log(
        `Updating TMDB season: ${season.season_number} for tmdb: ${tmdb.id}`,
      );

      const tmdbSeason = await this.fetchTmdbSeason(
        id,
        season.season_number || 1,
      );
      tmdbSeason.show_id = tmdb.id;
      await this.saveTmdbSeason(tmdbSeason);

      await sleep(15, false);
    }

    return tmdb;
  }

  // Matching Methods
  async findTmdb(id: number): Promise<TmdbWithRelations> {
    const tmdb = await this.findMatchInPrisma(id).catch(() => null);
    if (tmdb) return tmdb;
    return await this.fetchTmdbByAnilist(id);
  }

  async findMatchInPrisma(id: number): Promise<TmdbWithRelations> {
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
      include: getTmdbInclude(),
      take: 25,
    });

    const searchAnime: ExpectAnime = {
      title: {
        romaji: anilist.title?.romaji ?? undefined,
        english: anilist.title?.english ?? undefined,
        native: anilist.title?.native ?? undefined,
      },
      synonyms: anilist.synonyms,
    };

    const bestMatch = findBestMatch(
      searchAnime,
      candidates.map((result) => ({
        id: result.id,
        title: result.name ?? undefined,
        japaneseTitle: result.original_name ?? undefined,
      })),
    );

    if (!bestMatch) {
      throw new Error('No matching TMDb entry found');
    }

    return candidates.find(
      (c) => c.id === bestMatch.result.id,
    )! as TmdbWithRelations;
  }

  async detectType(id: number): Promise<string> {
    try {
      await this.fetchTmdb(id, 'tv');
      return 'tv';
    } catch (_) {
      try {
        await this.fetchTmdb(id, 'movie');
        return 'movie';
      } catch (_) {
        throw new Error('ID not found in TVDB as Movie or Series.');
      }
    }
  }
}
