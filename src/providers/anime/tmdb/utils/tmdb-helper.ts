import { Injectable } from '@nestjs/common';
import { Prisma, TmdbSeasonEpisode } from '@prisma/client';
import {
  TmdbWithRelations,
  TmdbSeasonWithRelations,
  TmdbSeasonEpisodeImagesWithRelations,
  BasicTmdb,
  TmdbDetails,
  TmdbDetailsMerged,
} from '../types/types.js';
import { ExpectAnime, findBestMatch } from '../../../mapper/mapper.helper.js';
import { AnilistWithRelations } from '../../anilist/types/types.js';

@Injectable()
export class TmdbHelper {
  getTmdbData(tmdb: TmdbDetailsMerged): Prisma.TmdbCreateInput {
    return {
      id: tmdb.id,
      adult: tmdb.adult ?? false,
      backdrop_path: tmdb.backdrop_path ?? undefined,
      episode_run_time: tmdb.episode_run_time ?? [],
      media_type: tmdb.media_type ?? undefined,
      first_air_date: tmdb.first_air_date ?? undefined,
      homepage: tmdb.homepage ?? undefined,
      in_production: tmdb.in_production ?? undefined,
      last_air_date: tmdb.last_air_date ?? undefined,
      name: tmdb.name ?? tmdb.title ?? undefined,
      number_of_episodes: tmdb.number_of_episodes ?? undefined,
      number_of_seasons: tmdb.number_of_seasons ?? undefined,
      original_language: tmdb.original_language ?? undefined,
      original_name: tmdb.original_name ?? tmdb.original_title ?? undefined,
      origin_country: tmdb.origin_country ?? [],
      overview: tmdb.overview ?? undefined,
      popularity: tmdb.popularity ?? undefined,
      poster_path: tmdb.poster_path ?? undefined,
      tagline: tmdb.tagline ?? undefined,
      status: tmdb.status ?? undefined,
      type: tmdb.type ?? undefined,
      vote_average: tmdb.vote_average ?? undefined,
      vote_count: tmdb.vote_count ?? undefined,

      // Add next episode to air
      next_episode_to_air: tmdb.next_episode_to_air
        ? {
            connectOrCreate: {
              where: { id: tmdb.next_episode_to_air.id },
              create: {
                id: tmdb.next_episode_to_air.id,
                name: tmdb.next_episode_to_air.name ?? undefined,
                overview: tmdb.next_episode_to_air.overview ?? undefined,
                vote_average:
                  tmdb.next_episode_to_air.vote_average ?? undefined,
                vote_count: tmdb.next_episode_to_air.vote_count ?? undefined,
                air_date: tmdb.next_episode_to_air.air_date ?? undefined,
                episode_number:
                  tmdb.next_episode_to_air.episode_number ?? undefined,
                episode_type:
                  tmdb.next_episode_to_air.episode_type ?? undefined,
                production_code:
                  tmdb.next_episode_to_air.production_code ?? undefined,
                runtime: tmdb.next_episode_to_air.runtime ?? undefined,
                season_number:
                  tmdb.next_episode_to_air.season_number ?? undefined,
                still_path: tmdb.next_episode_to_air.still_path ?? undefined,
              },
            },
          }
        : undefined,

      // Add last episode to air
      last_episode_to_air: tmdb.last_episode_to_air
        ? {
            connectOrCreate: {
              where: { id: tmdb.last_episode_to_air.id },
              create: {
                id: tmdb.last_episode_to_air.id,
                name: tmdb.last_episode_to_air.name ?? undefined,
                overview: tmdb.last_episode_to_air.overview ?? undefined,
                vote_average:
                  tmdb.last_episode_to_air.vote_average ?? undefined,
                vote_count: tmdb.last_episode_to_air.vote_count ?? undefined,
                air_date: tmdb.last_episode_to_air.air_date ?? undefined,
                episode_number:
                  tmdb.last_episode_to_air.episode_number ?? undefined,
                episode_type:
                  tmdb.last_episode_to_air.episode_type ?? undefined,
                production_code:
                  tmdb.last_episode_to_air.production_code ?? undefined,
                runtime: tmdb.last_episode_to_air.runtime ?? undefined,
                season_number:
                  tmdb.last_episode_to_air.season_number ?? undefined,
                still_path: tmdb.last_episode_to_air.still_path ?? undefined,
              },
            },
          }
        : undefined,

      // Update seasons relation
      seasons: {
        connectOrCreate:
          tmdb.seasons?.map((s) => ({
            where: { id: s.id },
            create: {
              id: s.id,
              air_date: s.air_date ?? undefined,
              episode_count: s.episode_count ?? undefined,
              name: s.name ?? undefined,
              overview: s.overview ?? undefined,
              poster_path: s.poster_path ?? undefined,
              season_number: s.season_number ?? undefined,
              vote_average: s.vote_average ?? undefined,
            },
          })) ?? [],
      },
    };
  }

  getTmdbSeasonData(
    tmdb: TmdbSeasonWithRelations,
  ): Prisma.TmdbSeasonCreateInput {
    return {
      id: tmdb.id,
      air_date: tmdb.air_date ?? undefined,
      name: tmdb.name ?? undefined,
      overview: tmdb.overview ?? undefined,
      poster_path: tmdb.poster_path ?? undefined,
      season_number: tmdb.season_number, // Required field
      vote_average: tmdb.vote_average ?? undefined,
      episodes: {
        connectOrCreate:
          tmdb.episodes?.map((e) => ({
            where: { id: e.id },
            create: {
              id: e.id,
              air_date: e.air_date ?? undefined,
              episode_number: e.episode_number,
              episode_type: e.episode_type ?? undefined,
              name: e.name ?? undefined,
              overview: e.overview ?? undefined,
              production_code: e.production_code ?? undefined,
              runtime: e.runtime ?? undefined,
              season_number: e.season_number,
              still_path: e.still_path ?? undefined,
              vote_average: e.vote_average ?? undefined,
              vote_count: e.vote_count ?? undefined,
              show: {
                connect: {
                  id: e.show_id,
                },
              },
            },
          })) ?? [],
      },
      show: {
        connect: {
          id: tmdb.show_id,
        },
      },
    };
  }

  getTmdbEpisodeImagesData(
    tmdb: TmdbSeasonEpisodeImagesWithRelations,
  ): Prisma.TmdbSeasonEpisodeImagesCreateInput {
    return {
      id: tmdb.id,
      stills: {
        create: tmdb.stills.map((s) => ({
          aspect_ratio: s.aspect_ratio ?? null,
          height: s.height ?? null,
          width: s.width ?? null,
          iso_639_1: s.iso_639_1 ?? null,
          file_path: s.file_path ?? null,
          vote_average: s.vote_average ?? null,
          vote_count: s.vote_count ?? null,
        })),
      },
      episode: {
        connect: {
          id: tmdb.episodeId,
        },
      },
    };
  }
}

const ALLOWED_COUNTRIES = ['JP', 'KR', 'CN'];
const ALLOWED_LANGUAGES = ['ja', 'ko', 'zh'];

const isProbablyAnime = (tmdb: BasicTmdb): boolean => {
  const countryMatch =
    tmdb.origin_country?.some((c) => ALLOWED_COUNTRIES.includes(c)) ?? false;

  const languageMatch = ALLOWED_LANGUAGES.includes(tmdb.original_language);

  return countryMatch || languageMatch;
};

export function findBestMatchFromSearch(
  anilist: AnilistWithRelations,
  results: BasicTmdb[] | undefined,
): BasicTmdb | null {
  if (!results || !Array.isArray(results)) return null;

  const searchAnime: ExpectAnime = {
    title: {
      romaji: (anilist.title as { romaji: string }).romaji,
      english: (anilist.title as { english: string }).english,
      native: (anilist.title as { native: string }).native,
    },
    synonyms: anilist.synonyms,
  };

  const resultsFiltered = results.filter((tmdb) => isProbablyAnime(tmdb));

  const bestMatch = findBestMatch(
    searchAnime,
    resultsFiltered.map((result) => ({
      id: result.id,
      title: result.name ?? result.title,
      japaneseTitle: result.original_name ?? result.original_title,
    })),
  );

  if (bestMatch) {
    return results.find((r) => r.id === bestMatch.result.id) || null;
  }

  return null;
}

export function filterSeasonEpisodes(
  seasonData: TmdbSeasonWithRelations,
): TmdbSeasonWithRelations {
  const filteredEpisodes = seasonData.episodes.map((episode) => ({
    id: episode.id,
    air_date: episode.air_date,
    episode_number: episode.episode_number,
    episode_type: episode.episode_type,
    name: episode.name,
    overview: episode.overview,
    production_code: episode.production_code,
    runtime: episode.runtime,
    season_number: episode.season_number,
    show_id: episode.show_id,
    still_path: episode.still_path,
    vote_average: episode.vote_average,
    vote_count: episode.vote_count,
  })) as TmdbSeasonEpisode[];

  seasonData.episodes = filteredEpisodes;
  return seasonData;
}
