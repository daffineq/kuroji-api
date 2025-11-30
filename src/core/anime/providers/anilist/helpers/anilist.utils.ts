import { ReleaseDate } from 'src/core/types';
import { DateUtils } from 'src/helpers/date';
import { AnilistMedia } from '../types';

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

const AnilistUtils = {
  findEpisodeCount,
  getDate
};

export { AnilistUtils };
