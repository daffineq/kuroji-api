import { DateUtils } from 'src/helpers/date';
import { AnilistMedia } from '../providers/anilist/types';
import { KitsuAnime } from '../providers/kitsu/types';
import { ShikimoriAnime } from '../providers/shikimori/types';

export const getEpisodesCount = (
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
