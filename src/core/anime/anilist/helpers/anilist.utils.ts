import { AnilistAiringSchedule } from '@prisma/client';
import { DateUtils } from 'src/helpers/date';

export function findEpisodeCount<
  T extends {
    episodes?: number | null;
    airingSchedule?: AnilistAiringSchedule[] | null;
    shikimori?: {
      episodes?: number | null;
      episodesAired?: number | null;
    } | null;
    kitsu?: {
      episodeCount?: number | null;
    } | null;
    status?: string | null;
  }
>(data: T, options?: { preferAired?: boolean }): number | undefined {
  const airedSchedule =
    data.airingSchedule
      ?.filter((schedule) => schedule.airingAt != null && DateUtils.isPast(schedule.airingAt))
      .sort((a, b) => (b.airingAt ?? 0) - (a.airingAt ?? 0)) ?? [];

  const totalEpisodes: (number | null | undefined)[] = [
    data.episodes,
    data.shikimori?.episodes,
    data.kitsu?.episodeCount
  ];

  const airedEpisodes: (number | null | undefined)[] = [data.shikimori?.episodesAired, airedSchedule?.length];

  const total = totalEpisodes.find((v) => typeof v === 'number' && v > 0);
  const aired = airedEpisodes.find((v) => typeof v === 'number' && v > 0);

  const isAiring = data.status === 'RELEASING';

  if (options?.preferAired ?? isAiring) {
    if (aired) return aired;
  }

  if (total) return total;
  if (aired) return aired;

  return undefined;
}
