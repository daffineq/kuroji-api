import { DateUtils } from 'src/helpers/date';
import { AnilistMedia } from '../providers/anilist/types';
import { KitsuAnime } from '../providers/kitsu/types';
import { ShikimoriAnime } from '../providers/shikimori/types';

const getEpisodesCount = (
  anilist: AnilistMedia,
  kitsu: KitsuAnime | null,
  shikimori: ShikimoriAnime | null
): number | undefined | null => {
  const airedSchedule =
    anilist.airingSchedule?.edges
      ?.filter((schedule) => schedule.node.airingAt != null && DateUtils.isPast(schedule.node.airingAt))
      .sort((a, b) => (b.node.airingAt ?? 0) - (a.node.airingAt ?? 0)) ?? [];

  const totalEpisodes: (number | null | undefined)[] = [
    anilist.episodes,
    shikimori?.episodes,
    kitsu?.attributes.episodeCount
  ];

  const airedEpisodes: (number | null | undefined)[] = [shikimori?.episodesAired, airedSchedule?.length];

  const total = totalEpisodes.find((v) => typeof v === 'number' && v > 0);
  const aired = airedEpisodes.find((v) => typeof v === 'number' && v > 0);

  const isAiring = anilist.status === 'RELEASING';

  if (isAiring) {
    return aired;
  }

  return total ?? aired ?? null;
};

const pickBestTitle = (a: AnilistMedia): string | null => {
  return a.title.english ?? a.title.romaji ?? a.title.native ?? null;
};

const getType = (format: string | null | undefined): 'movie' | 'series' => {
  switch (format) {
    case 'MOVIE':
      return 'movie';
    case 'TV':
    case 'ONA':
    case 'OVA':
    case 'SPECIAL':
    case 'TV_SHORT':
      return 'series';
    default:
      return 'series';
  }
};

const AnimeUtils = {
  getEpisodesCount,
  pickBestTitle,
  getType
};

export { AnimeUtils };
