import { Injectable } from '@nestjs/common'
import { Prisma, Tmdb, TmdbSeason } from '@prisma/client'
import { TmdbSeasonWithRelations } from '../service/tmdb.service'

@Injectable()
export class TmdbHelper {
  getTmdbData(tmdb: any): Prisma.TmdbCreateInput {
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
      name: tmdb.name ?? undefined,
      number_of_episodes: tmdb.number_of_episodes ?? undefined,
      number_of_seasons: tmdb.number_of_seasons ?? undefined,
      original_language: tmdb.original_language ?? undefined,
      original_name: tmdb.original_name ?? undefined,
      origin_country: tmdb.origin_country ?? [],
      overview: tmdb.overview ?? undefined,
      popularity: tmdb.popularity ?? undefined,
      poster_path: tmdb.poster_path ?? undefined,
      tagline: tmdb.tagline ?? undefined,
      status: tmdb.status ?? undefined,
      type: tmdb.type ?? undefined,
      vote_average: tmdb.vote_average ?? undefined,
      vote_count: tmdb.vote_count ?? undefined,
      seasons: {
        connectOrCreate: tmdb.seasons.map((s: any) => ({
          where: { id: s.id },
          create: {
            id: s.id ?? undefined,
            air_date: s.air_date ?? undefined,
            episode_count: s.episode_count ?? undefined,
            name: s.name ?? undefined,
            overview: s.overview ?? undefined,
            poster_path: s.poster_path ?? undefined,
            season_number: s.season_number ?? undefined,
            vote_average: s.vote_average ?? undefined,
          }
        })) ?? []
      },
    }
  }

  getTmdbSeasonData(tmdb: any): Prisma.TmdbSeasonCreateInput {
    return {
      id: tmdb.id,
      air_date: tmdb.air_date ?? undefined,
      show_id: tmdb.show_id ?? undefined,
      name: tmdb.name ?? undefined,
      overview: tmdb.overview ?? undefined,
      poster_path: tmdb.poster_path ?? undefined,
      season_number: tmdb.season_number ?? undefined,
      vote_average: tmdb.vote_average ?? undefined,
      episodes: {
        connectOrCreate: tmdb.episodes.map((e: any) => ({
          where: { id: e.id },
          create: {
            id: e.id ?? undefined,
            air_date: e.air_date ?? undefined,
            episode_number: e.episode_number ?? undefined,
            episode_type: e.episode_type ?? undefined,
            name: e.name ?? undefined,
            overview: e.overview ?? undefined,
            production_code: e.production_code ?? undefined,
            runtime: e.runtime ?? undefined,
            season_number: e.season_number ?? undefined,
            show_id: e.show_id ?? undefined,
            still_path: e.still_path ?? undefined,
            vote_average: e.vote_average ?? undefined,
            vote_count: e.vote_count ?? undefined,
          }
        })) ?? []
      },
    }
  }
}