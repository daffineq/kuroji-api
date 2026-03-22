import { ReleaseDate } from 'src/core/types';
import { DateUtils } from 'src/helpers/date';
import { AnilistMedia } from '../types';
import {
  AnimeAiringSchedulePayload,
  AnimeCharacterConnectionPayload,
  AnimeLinkPayload,
  AnimeOtherTitlePayload,
  AnimePayload,
  AnimeRecommendationPayload,
  AnimeScoreDistributionPayload,
  AnimeStatusDistributionPayload,
  AnimeStudioConnectionPayload,
  AnimeTagConnectionPayload
} from 'src/core/anime';
import { forced } from 'src/helpers/forced';

const findEpisodeCount = (data: AnilistMedia, options?: { preferAired?: boolean }): number | undefined => {
  const airedSchedule =
    data.airingSchedule?.edges
      ?.filter((schedule) => schedule.node.airingAt != null && DateUtils.isPast(schedule.node.airingAt))
      .sort((a, b) => (b.node.airingAt ?? 0) - (a.node.airingAt ?? 0)) ?? [];

  const totalEpisodes: (number | null | undefined)[] = [data.episodes];

  const airedEpisodes: (number | null | undefined)[] = [airedSchedule?.length];

  const total = totalEpisodes.find((v) => typeof v === 'number' && v > 0);
  const aired = airedEpisodes.find((v) => typeof v === 'number' && v > 0);

  const isAiring = data.status === 'RELEASING';

  if (options?.preferAired ?? isAiring) {
    if (aired) return aired;
  }

  if (total) return total;
  if (aired) return aired;

  return undefined;
};

const getDate = (date: ReleaseDate): string | null => {
  const { year, month, day } = date;

  let anilistStartDateString: string | null = null;

  if (year && month && day) {
    anilistStartDateString = `${year.toString().padStart(4, '0')}-${month
      .toString()
      .padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  return anilistStartDateString;
};

const anilistToAnimePayload = (media: AnilistMedia): AnimePayload => {
  const characters: AnimeCharacterConnectionPayload[] = (media.characters?.edges ?? [])
    .filter((edge) => edge?.node?.id)
    .map((edge) => ({
      id: edge.id,
      role: edge.role ?? null,
      role_i: {
        MAIN: 0,
        SUPPORTING: 1,
        BACKGROUND: 2
      }[edge.role ?? 'BACKGROUND'],
      character: {
        id: edge.node.id,
        name: {
          full: edge.node.name?.full ?? null,
          native: edge.node.name?.native ?? null,
          alternative: [...(edge.node.name?.alternative ?? []), ...(edge.node.name?.alternativeSpoiler ?? [])]
        },
        image: {
          large: edge.node.image?.large ?? null,
          medium: edge.node.image?.medium ?? null
        }
      },
      voice_actors: (edge.voiceActors ?? []).map((va) => ({
        id: va.id,
        language: va.languageV2 ?? null,
        name: {
          full: va.name?.full ?? null,
          native: va.name?.native ?? null,
          alternative: va.name?.alternative ?? null
        },
        image: {
          large: va.image?.large ?? null,
          medium: va.image?.medium ?? null
        }
      }))
    }));

  const studios: AnimeStudioConnectionPayload[] = (media.studios?.edges ?? [])
    .filter((edge) => edge?.node?.id)
    .map((edge) => ({
      id: edge.id,
      is_main: edge.isMain ?? null,
      studio: {
        id: edge.node.id,
        name: edge.node.name ?? null
      }
    }));

  const tags: AnimeTagConnectionPayload[] = (media.tags ?? [])
    .filter((tag) => tag?.id)
    .map((tag) => ({
      rank: tag.rank ?? null,
      is_spoiler: tag.isMediaSpoiler ?? null,
      tag: {
        id: tag.id,
        name: tag.name ?? null,
        description: tag.description ?? null,
        category: tag.category ?? null,
        is_adult: tag.isAdult ?? null
      }
    }));

  const airing_schedule: AnimeAiringSchedulePayload[] = (media.airingSchedule?.edges ?? [])
    .filter((edge) => edge?.node?.id)
    .map((edge) => ({
      id: edge.node.id,
      episode: edge.node.episode ?? null,
      airing_at: edge.node.airingAt ?? null
    }));

  const links: AnimeLinkPayload[] = (media.externalLinks ?? [])
    .filter((link) => link?.url && link?.site)
    .map((link) => ({
      link: link.url,
      label: link.site,
      type: 'website'
    }));

  const score_distribution: AnimeScoreDistributionPayload[] = (media.stats?.scoreDistribution ?? [])
    .filter((d) => d?.score != null && d?.amount != null)
    .map((d) => ({
      score: d.score,
      amount: d.amount
    }));

  const status_distribution: AnimeStatusDistributionPayload[] = (media.stats?.statusDistribution ?? [])
    .filter((d) => d?.status && d?.amount != null)
    .map((d) => ({
      status: d.status,
      amount: d.amount
    }));

  const genres = (media.genres ?? []).filter(Boolean).map((name) => ({ name }));

  const recommendations: AnimeRecommendationPayload[] = (media.recommendations?.edges ?? [])
    .filter((r) => r.node.media?.id && r.node.mediaRecommendation?.id)
    .map((r, i) => ({
      parent_id: r.node.media?.id!,
      related_id: r.node.mediaRecommendation?.id!,
      order: i
    }));

  const other_titles: AnimeOtherTitlePayload[] = (media.synonyms ?? []).map((s) => ({
    title: s,
    source: 'anilist',
    language: 'any'
  }));

  return {
    id: media.id,
    id_mal: media.idMal ?? null,
    background: media.bannerImage ?? null,
    description: media.description ?? null,
    status: media.status ?? null,
    type: media.type ?? null,
    format: media.format ?? null,
    season: media.season ?? null,
    season_year: media.seasonYear ?? null,
    duration: media.duration ?? null,
    country: media.countryOfOrigin ?? null,
    is_licensed: media.isLicensed ?? null,
    source: media.source ?? null,
    hashtag: media.hashtag ?? null,
    is_adult: media.isAdult ?? null,
    score: media.averageScore ?? null,
    popularity: media.popularity ?? null,
    trending: media.trending ?? null,
    favorites: media.favourites ?? null,
    color: media.coverImage?.color ?? null,
    episodes_total: media.episodes ?? null,

    title: {
      romaji: media.title?.romaji ?? null,
      english: media.title?.english ?? null,
      native: media.title?.native ?? null
    },

    poster: {
      small: media.coverImage?.medium ?? null,
      medium: media.coverImage?.large ?? null,
      large: media.coverImage?.extraLarge ?? null
    },

    start_date: media.startDate
      ? {
          year: media.startDate.year ?? null,
          month: media.startDate.month ?? null,
          day: media.startDate.day ?? null
        }
      : null,

    end_date: media.endDate
      ? {
          year: media.endDate.year ?? null,
          month: media.endDate.month ?? null,
          day: media.endDate.day ?? null
        }
      : null,

    other_titles,

    genres: genres.length ? forced(genres) : null,
    airing_schedule: airing_schedule.length ? forced(airing_schedule) : null,
    characters: characters.length ? forced(characters) : null,
    studios: studios.length ? forced(studios) : null,
    tags: tags.length ? forced(tags) : null,
    score_distribution: score_distribution.length ? forced(score_distribution) : null,
    status_distribution: status_distribution.length ? forced(status_distribution) : null,
    links,
    recommendations: recommendations.length ? forced(recommendations) : null
  };
};

const AnilistUtils = {
  findEpisodeCount,
  getDate,
  anilistToAnimePayload
};

export { AnilistUtils };
