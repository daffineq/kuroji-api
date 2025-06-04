import { Injectable } from '@nestjs/common';
import {
  Prisma,
  TvdbLogin,
  TvdbLanguageTranslation,
  TvdbLanguage,
} from '@prisma/client';
import { TvdbInput } from '../types/types';

@Injectable()
export class TvdbHelper {
  getTvdbData(tvdb: TvdbInput): Prisma.TvdbCreateInput {
    return {
      id: tvdb.id,
      tmdbId: tvdb.tmdbId ?? undefined,
      type: tvdb.type ?? undefined,
      name: tvdb.name ?? undefined,
      slug: tvdb.slug ?? undefined,
      image: tvdb.image ?? undefined,
      score: tvdb.score ?? undefined,
      runtime: tvdb.runtime ?? undefined,
      lastUpdated: tvdb.lastUpdated ?? undefined,
      year: tvdb.year ?? undefined,
      nameTranslations: tvdb.nameTranslations ?? [],
      overviewTranslations: tvdb.overviewTranslations ?? [],
      status: tvdb.status
        ? {
            connectOrCreate: {
              where: { id: tvdb.status.id },
              create: {
                id: tvdb.status.id ?? undefined,
                name: tvdb.status.name ?? undefined,
                recordType: tvdb.status.recordType ?? undefined,
                keepUpdated: tvdb.status.keepUpdated ?? false,
              },
            },
          }
        : undefined,
      aliases: {
        create:
          tvdb.aliases?.map((alias) => ({
            name: alias.name ?? undefined,
            language: alias.language ?? undefined,
          })) ?? [],
      },
      artworks: {
        connectOrCreate:
          tvdb.artworks?.map((art) => ({
            where: { id: art.id },
            create: {
              id: art.id ?? undefined,
              height: art.height ?? undefined,
              image: art.image ?? undefined,
              includesText: art.includesText ?? undefined,
              language: art.language ?? undefined,
              score: art.score ?? undefined,
              thumbnail: art.thumbnail ?? undefined,
              type: art.type ?? undefined,
              width: art.width ?? undefined,
            },
          })) ?? [],
      },
      remoteIds: {
        connectOrCreate:
          tvdb.remoteIds?.map((remote) => ({
            where: { id: remote.id },
            create: {
              id: remote.id ?? undefined,
              type: remote.type ?? undefined,
              sourceName: remote.sourceName ?? undefined,
            },
          })) ?? [],
      },
      trailers: {
        connectOrCreate:
          tvdb.trailers?.map((trailer) => ({
            where: { id: trailer.id },
            create: {
              id: trailer.id ?? undefined,
              url: trailer.url ?? undefined,
              name: trailer.name ?? undefined,
              runtime: trailer.runtime ?? undefined,
              language: trailer.language ?? undefined,
            },
          })) ?? [],
      },

      airsDays: tvdb.airsDays
        ? {
            create: {
              monday: tvdb.airsDays.monday,
              tuesday: tvdb.airsDays.tuesday,
              wednesday: tvdb.airsDays.wednesday,
              thursday: tvdb.airsDays.thursday,
              friday: tvdb.airsDays.friday,
              saturday: tvdb.airsDays.saturday,
              sunday: tvdb.airsDays.sunday,
            },
          }
        : undefined,

      airsTime: tvdb.airsTime ?? undefined,
    };
  }

  getTvdbLoginData(tvdb: TvdbLogin): Prisma.TvdbLoginCreateInput {
    return {
      token: tvdb.token,
      createDate: tvdb.createDate ?? new Date(),
      expired: tvdb.expired ?? false,
    };
  }

  getTvdbLanguageTranslationData(
    translation: TvdbLanguageTranslation,
  ): Prisma.TvdbLanguageTranslationCreateInput {
    return {
      tvdbId: translation.tvdbId,
      name: translation.name ?? undefined,
      overview: translation.overview ?? undefined,
      isAlias: translation.isAlias ?? undefined,
      isPrimary: translation.isPrimary ?? undefined,
      language: translation.language ?? undefined,
      tagline: translation.tagline ?? undefined,
      aliases: translation.aliases ?? [],
    };
  }

  getTvdbLanguageData(language: TvdbLanguage): Prisma.TvdbLanguageCreateInput {
    return {
      id: language.id,
      name: language.name ?? undefined,
      nativeName: language.nativeName ?? undefined,
      shortCode: language.shortCode ?? undefined,
    };
  }
}

export function getTvdbInclude(): Prisma.TvdbInclude {
  const include = {
    status: {
      omit: {
        id: true,
        tvdbId: true,
      },
    },
    aliases: {
      omit: {
        id: true,
      },
    },
    artworks: true,
    remoteIds: true,
    trailers: true,
    airsDays: {
      omit: {
        id: true,
        tvdbId: true,
      },
    },
  };

  return include;
}
