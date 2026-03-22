import DataLoader from 'dataloader';
import {
  db,
  anime,
  animeTitle,
  animeStartDate,
  animeEndDate,
  animePoster,
  animeGenre,
  animeToGenre,
  animeAiringSchedule,
  animeToAiringSchedule,
  animeCharacter,
  animeCharacterName,
  animeCharacterImage,
  animeToCharacter,
  characterToVoiceActor,
  animeVoiceActor,
  animeVoiceName,
  animeVoiceImage,
  animeStudio,
  animeToStudio,
  animeTag,
  animeToTag,
  animeScoreDistribution,
  animeStatusDistribution,
  animeLink,
  animeToLink,
  animeOtherTitle,
  animeToOtherTitle,
  animeOtherDescription,
  animeToOtherDescription,
  animeImage,
  animeToImage,
  animeVideo,
  animeToVideo,
  animeScreenshot,
  animeToScreenshot,
  animeArtwork,
  animeToArtwork,
  animeChronology,
  animeRecommendation,
  animeEpisode,
  animeEpisodeImage
} from 'src/db';
import { eq, inArray, asc, desc, and } from 'drizzle-orm';
import { formatEpisodeData, MergedEpisode } from './types';
import { Crysoline, Episode, TmdbSeasons } from '../anime';

function groupBy<T>(rows: T[], key: (row: T) => number | string): Map<number | string, T[]> {
  const map = new Map<number | string, T[]>();
  for (const row of rows) {
    const k = key(row);
    const bucket = map.get(k);
    if (bucket) bucket.push(row);
    else map.set(k, [row]);
  }
  return map;
}

function indexBy<T>(rows: T[], key: (row: T) => number | string): Map<number | string, T> {
  const map = new Map<number | string, T>();
  for (const row of rows) map.set(key(row), row);
  return map;
}

export function createLoaders() {
  const poster = new DataLoader<number, typeof animePoster.$inferSelect | null>(
    async (ids) => {
      const rows = await db
        .select()
        .from(animePoster)
        .where(inArray(animePoster.anime_id, [...ids]));
      const map = indexBy(rows, (r) => r.anime_id);
      return ids.map((id) => map.get(id) ?? null);
    },
    { cache: true }
  );

  const title = new DataLoader<number, typeof animeTitle.$inferSelect | null>(
    async (ids) => {
      const rows = await db
        .select()
        .from(animeTitle)
        .where(inArray(animeTitle.anime_id, [...ids]));
      const map = indexBy(rows, (r) => r.anime_id);
      return ids.map((id) => map.get(id) ?? null);
    },
    { cache: true }
  );

  const startDate = new DataLoader<number, typeof animeStartDate.$inferSelect | null>(
    async (ids) => {
      const rows = await db
        .select()
        .from(animeStartDate)
        .where(inArray(animeStartDate.anime_id, [...ids]));
      const map = indexBy(rows, (r) => r.anime_id);
      return ids.map((id) => map.get(id) ?? null);
    },
    { cache: true }
  );

  const endDate = new DataLoader<number, typeof animeEndDate.$inferSelect | null>(
    async (ids) => {
      const rows = await db
        .select()
        .from(animeEndDate)
        .where(inArray(animeEndDate.anime_id, [...ids]));
      const map = indexBy(rows, (r) => r.anime_id);
      return ids.map((id) => map.get(id) ?? null);
    },
    { cache: true }
  );

  const genres = new DataLoader<number, (typeof animeGenre.$inferSelect)[]>(
    async (ids) => {
      const rows = await db
        .select({ anime_id: animeToGenre.A, genre: animeGenre })
        .from(animeToGenre)
        .innerJoin(animeGenre, eq(animeToGenre.B, animeGenre.id))
        .where(inArray(animeToGenre.A, [...ids]))
        .orderBy(asc(animeGenre.name));
      const map = groupBy(rows, (r) => r.anime_id);
      return ids.map((id) => (map.get(id) ?? []).map((r) => r.genre));
    },
    { cache: true }
  );

  const airingSchedule = new DataLoader<number, (typeof animeAiringSchedule.$inferSelect)[]>(
    async (ids) => {
      const rows = await db
        .select({ anime_id: animeToAiringSchedule.A, schedule: animeAiringSchedule })
        .from(animeToAiringSchedule)
        .innerJoin(animeAiringSchedule, eq(animeToAiringSchedule.B, animeAiringSchedule.id))
        .where(inArray(animeToAiringSchedule.A, [...ids]))
        .orderBy(asc(animeAiringSchedule.episode));
      const map = groupBy(rows, (r) => r.anime_id);
      return ids.map((id) => (map.get(id) ?? []).map((r) => r.schedule));
    },
    { cache: true }
  );

  const studioConnections = new DataLoader<number, (typeof animeToStudio.$inferSelect)[]>(
    async (ids) => {
      const rows = (
        await db
          .select({ connection: animeToStudio })
          .from(animeToStudio)
          .innerJoin(animeStudio, eq(animeStudio.id, animeToStudio.studio_id))
          .where(inArray(animeToStudio.anime_id, [...ids]))
          .orderBy(desc(animeToStudio.is_main), asc(animeStudio.name))
      ).map((r) => r.connection);
      const map = groupBy(rows, (r) => r.anime_id);
      return ids.map((id) => map.get(id) ?? []);
    },
    { cache: true }
  );

  const studio = new DataLoader<number, typeof animeStudio.$inferSelect | null>(
    async (ids) => {
      const rows = await db
        .select()
        .from(animeStudio)
        .where(inArray(animeStudio.id, [...ids]));
      const map = indexBy(rows, (r) => r.id);
      return ids.map((id) => map.get(id) ?? null);
    },
    {
      cache: true
    }
  );

  const tagConnections = new DataLoader<number, (typeof animeToTag.$inferSelect)[]>(
    async (ids) => {
      const rows = (
        await db
          .select({ connnection: animeToTag })
          .from(animeToTag)
          .innerJoin(animeTag, eq(animeTag.id, animeToTag.tag_id))
          .where(inArray(animeToTag.anime_id, [...ids]))
          .orderBy(desc(animeToTag.rank), asc(animeTag.name))
      ).map((r) => r.connnection);
      const map = groupBy(rows, (r) => r.anime_id);
      return ids.map((id) => map.get(id) ?? []);
    },
    { cache: true }
  );

  const tag = new DataLoader<number, typeof animeTag.$inferSelect | null>(
    async (ids) => {
      const rows = await db
        .select()
        .from(animeTag)
        .where(inArray(animeTag.id, [...ids]));
      const map = indexBy(rows, (r) => r.id);
      return ids.map((id) => map.get(id) ?? null);
    },
    {
      cache: true
    }
  );

  const scoreDistribution = new DataLoader<number, (typeof animeScoreDistribution.$inferSelect)[]>(
    async (ids) => {
      const rows = await db
        .select()
        .from(animeScoreDistribution)
        .where(inArray(animeScoreDistribution.anime_id, [...ids]))
        .orderBy(asc(animeScoreDistribution.score));
      const map = groupBy(rows, (r) => r.anime_id);
      return ids.map((id) => map.get(id) ?? []);
    },
    { cache: true }
  );

  const statusDistribution = new DataLoader<number, (typeof animeStatusDistribution.$inferSelect)[]>(
    async (ids) => {
      const rows = await db
        .select()
        .from(animeStatusDistribution)
        .where(inArray(animeStatusDistribution.anime_id, [...ids]))
        .orderBy(asc(animeStatusDistribution.status));
      const map = groupBy(rows, (r) => r.anime_id);
      return ids.map((id) => map.get(id) ?? []);
    },
    { cache: true }
  );

  const links = new DataLoader<number, (typeof animeLink.$inferSelect)[]>(
    async (ids) => {
      const rows = await db
        .select({ anime_id: animeToLink.A, link: animeLink })
        .from(animeToLink)
        .innerJoin(animeLink, eq(animeToLink.B, animeLink.id))
        .where(inArray(animeToLink.A, [...ids]))
        .orderBy(asc(animeLink.label));
      const map = groupBy(rows, (r) => r.anime_id);
      return ids.map((id) => (map.get(id) ?? []).map((r) => r.link));
    },
    { cache: true }
  );

  const otherTitles = new DataLoader<number, (typeof animeOtherTitle.$inferSelect)[]>(
    async (ids) => {
      const rows = await db
        .select({ anime_id: animeToOtherTitle.A, title: animeOtherTitle })
        .from(animeToOtherTitle)
        .innerJoin(animeOtherTitle, eq(animeToOtherTitle.B, animeOtherTitle.id))
        .where(inArray(animeToOtherTitle.A, [...ids]))
        .orderBy(asc(animeOtherTitle.source), asc(animeOtherTitle.language));
      const map = groupBy(rows, (r) => r.anime_id);
      return ids.map((id) => (map.get(id) ?? []).map((r) => r.title));
    },
    { cache: true }
  );

  const otherDescriptions = new DataLoader<number, (typeof animeOtherDescription.$inferSelect)[]>(
    async (ids) => {
      const rows = await db
        .select({ anime_id: animeToOtherDescription.A, description: animeOtherDescription })
        .from(animeToOtherDescription)
        .innerJoin(animeOtherDescription, eq(animeToOtherDescription.B, animeOtherDescription.id))
        .where(inArray(animeToOtherDescription.A, [...ids]))
        .orderBy(asc(animeOtherDescription.source), asc(animeOtherDescription.language));
      const map = groupBy(rows, (r) => r.anime_id);
      return ids.map((id) => (map.get(id) ?? []).map((r) => r.description));
    },
    { cache: true }
  );

  const images = new DataLoader<number, (typeof animeImage.$inferSelect)[]>(
    async (ids) => {
      const rows = await db
        .select({ anime_id: animeToImage.A, image: animeImage })
        .from(animeToImage)
        .innerJoin(animeImage, eq(animeToImage.B, animeImage.id))
        .where(inArray(animeToImage.A, [...ids]))
        .orderBy(asc(animeImage.type), asc(animeImage.source));
      const map = groupBy(rows, (r) => r.anime_id);
      return ids.map((id) => (map.get(id) ?? []).map((r) => r.image));
    },
    { cache: true }
  );

  const videos = new DataLoader<number, (typeof animeVideo.$inferSelect)[]>(
    async (ids) => {
      const rows = await db
        .select({ anime_id: animeToVideo.A, video: animeVideo })
        .from(animeToVideo)
        .innerJoin(animeVideo, eq(animeToVideo.B, animeVideo.id))
        .where(inArray(animeToVideo.A, [...ids]))
        .orderBy(asc(animeVideo.type), asc(animeVideo.title));
      const map = groupBy(rows, (r) => r.anime_id);
      return ids.map((id) => (map.get(id) ?? []).map((r) => r.video));
    },
    { cache: true }
  );

  const screenshots = new DataLoader<number, (typeof animeScreenshot.$inferSelect)[]>(
    async (ids) => {
      const rows = await db
        .select({ anime_id: animeToScreenshot.A, screenshot: animeScreenshot })
        .from(animeToScreenshot)
        .innerJoin(animeScreenshot, eq(animeToScreenshot.B, animeScreenshot.id))
        .where(inArray(animeToScreenshot.A, [...ids]))
        .orderBy(asc(animeScreenshot.order));
      const map = groupBy(rows, (r) => r.anime_id);
      return ids.map((id) => (map.get(id) ?? []).map((r) => r.screenshot));
    },
    { cache: true }
  );

  const artworks = new DataLoader<number, (typeof animeArtwork.$inferSelect)[]>(
    async (ids) => {
      const rows = await db
        .select({ anime_id: animeToArtwork.A, artwork: animeArtwork })
        .from(animeToArtwork)
        .innerJoin(animeArtwork, eq(animeToArtwork.B, animeArtwork.id))
        .where(inArray(animeToArtwork.A, [...ids]))
        .orderBy(asc(animeArtwork.type), asc(animeArtwork.iso_639_1));
      const map = groupBy(rows, (r) => r.anime_id);
      return ids.map((id) => (map.get(id) ?? []).map((r) => r.artwork));
    },
    { cache: true }
  );

  const chronology = new DataLoader<number, (typeof anime.$inferSelect)[]>(
    async (ids) => {
      const entries = await db
        .select()
        .from(animeChronology)
        .where(inArray(animeChronology.anime_id, [...ids]))
        .orderBy(asc(animeChronology.order));

      const relatedIds = [...new Set(entries.map((e) => e.related_id))];
      if (!relatedIds.length) return ids.map(() => []);

      const animeRows = (
        await db
          .select({ a: anime })
          .from(anime)
          .innerJoin(animeChronology, eq(animeChronology.related_id, anime.id_mal))
          .where(inArray(anime.id_mal, relatedIds))
          .orderBy(asc(animeChronology.order))
      ).map((r) => r.a);
      const animeByMalId = indexBy(animeRows, (a) => a.id_mal!);
      const entriesByAnimeId = groupBy(entries, (e) => e.anime_id);

      return ids.map((id) =>
        (entriesByAnimeId.get(id) ?? [])
          .map((e) => animeByMalId.get(e.related_id))
          .filter((a): a is typeof anime.$inferSelect => !!a)
      );
    },
    { cache: true }
  );

  const recommendations = new DataLoader<number, (typeof anime.$inferSelect)[]>(
    async (ids) => {
      const entries = await db
        .select()
        .from(animeRecommendation)
        .where(inArray(animeRecommendation.anime_id, [...ids]))
        .orderBy(asc(animeRecommendation.order));

      const relatedIds = [...new Set(entries.map((e) => e.related_id))];
      if (!relatedIds.length) return ids.map(() => []);

      const animeRows = await db.select().from(anime).where(inArray(anime.id, relatedIds));
      const animeById = indexBy(animeRows, (r) => r.id);
      const entriesByAnimeId = groupBy(entries, (e) => e.anime_id);

      return ids.map((id) =>
        (entriesByAnimeId.get(id) ?? [])
          .map((e) => animeById.get(e.related_id))
          .filter((a): a is typeof anime.$inferSelect => !!a)
      );
    },
    { cache: true }
  );

  const characterConnections = new DataLoader<number, (typeof animeToCharacter.$inferSelect)[]>(
    async (ids) => {
      const rows = await db
        .select()
        .from(animeToCharacter)
        .where(inArray(animeToCharacter.anime_id, [...ids]))
        .orderBy(asc(animeToCharacter.role_i), asc(animeToCharacter.character_id));
      const map = groupBy(rows, (r) => r.anime_id);
      return ids.map((id) => map.get(id) ?? []);
    },
    { cache: true }
  );

  const character = new DataLoader<number, typeof animeCharacter.$inferSelect | null>(
    async (ids) => {
      const rows = await db
        .select()
        .from(animeCharacter)
        .where(inArray(animeCharacter.id, [...ids]));
      const map = indexBy(rows, (r) => r.id);
      return ids.map((id) => map.get(id) ?? null);
    },
    { cache: true }
  );

  const characterName = new DataLoader<number, typeof animeCharacterName.$inferSelect | null>(
    async (ids) => {
      const rows = await db
        .select()
        .from(animeCharacterName)
        .where(inArray(animeCharacterName.character_id, [...ids]));
      const map = indexBy(rows, (r) => r.character_id!);
      return ids.map((id) => map.get(id) ?? null);
    },
    { cache: true }
  );

  const characterImage = new DataLoader<number, typeof animeCharacterImage.$inferSelect | null>(
    async (ids) => {
      const rows = await db
        .select()
        .from(animeCharacterImage)
        .where(inArray(animeCharacterImage.character_id, [...ids]));
      const map = indexBy(rows, (r) => r.character_id!);
      return ids.map((id) => map.get(id) ?? null);
    },
    { cache: true }
  );

  const voiceActors = new DataLoader<number, (typeof animeVoiceActor.$inferSelect)[]>(
    async (ids) => {
      const rows = await db
        .select({ connection_id: characterToVoiceActor.A, voiceActor: animeVoiceActor })
        .from(characterToVoiceActor)
        .innerJoin(animeVoiceActor, eq(characterToVoiceActor.B, animeVoiceActor.id))
        .where(inArray(characterToVoiceActor.A, [...ids]))
        .orderBy(asc(animeVoiceActor.language));
      const map = groupBy(rows, (r) => r.connection_id);
      return ids.map((id) => (map.get(id) ?? []).map((r) => r.voiceActor));
    },
    { cache: true }
  );

  const voiceName = new DataLoader<number, typeof animeVoiceName.$inferSelect | null>(
    async (ids) => {
      const rows = await db
        .select()
        .from(animeVoiceName)
        .where(inArray(animeVoiceName.voice_actor_id, [...ids]));
      const map = indexBy(rows, (r) => r.voice_actor_id!);
      return ids.map((id) => map.get(id) ?? null);
    },
    { cache: true }
  );

  const voiceImage = new DataLoader<number, typeof animeVoiceImage.$inferSelect | null>(
    async (ids) => {
      const rows = await db
        .select()
        .from(animeVoiceImage)
        .where(inArray(animeVoiceImage.voice_actor_id, [...ids]));
      const map = indexBy(rows, (r) => r.voice_actor_id!);
      return ids.map((id) => map.get(id) ?? null);
    },
    { cache: true }
  );

  const episodes = new DataLoader<number, MergedEpisode[]>(
    async (ids) => {
      const results = await Promise.all(
        ids.map(async (id) => {
          const [providerEpisodes, tmdbEpisodes] = await Promise.all([
            Crysoline.episodes(id).catch(() => []),
            (
              await db
                .select({ episode: animeEpisode, image: animeEpisodeImage })
                .from(animeEpisode)
                .leftJoin(animeEpisodeImage, eq(animeEpisodeImage.episode_id, animeEpisode.id))
                .where(eq(animeEpisode.anime_id, id))
            ).map((e) => {
              return {
                ...e.episode,
                image: e.image
              };
            })
          ]);

          const providerMap = new Map(
            providerEpisodes.filter((ep) => ep.number != null).map((ep) => [ep.number, ep])
          );

          const mergeEpisode = (tmdbEp: MergedEpisode): MergedEpisode => {
            const providerEp = providerMap.get(tmdbEp.number);
            providerMap.delete(tmdbEp.number);
            return {
              number: tmdbEp.number,
              title: tmdbEp.title || providerEp?.title || null,
              overview: tmdbEp.overview || providerEp?.description || null,
              image: tmdbEp.image ?? providerEp?.image ?? null,
              runtime: tmdbEp.runtime ?? null,
              air_date: tmdbEp.air_date ?? null,
              is_filler: providerEp?.is_filler ?? false,
              providers: providerEp?.providers ?? []
            };
          };

          const fromProvider = (ep: Episode): MergedEpisode => ({
            number: ep.number!,
            title: ep.title ?? null,
            overview: ep.description ?? null,
            image: ep.image ?? null,
            runtime: null,
            air_date: null,
            is_filler: ep.is_filler ?? false,
            providers: ep.providers
          });

          const merged = [
            ...tmdbEpisodes.map(formatEpisodeData).map(mergeEpisode),
            ...Array.from(providerMap.values()).map(fromProvider)
          ];

          return merged.sort((a, b) => a.number - b.number);
        })
      );
      return results;
    },
    {
      cache: true
    }
  );

  return {
    poster,
    title,
    startDate,
    endDate,
    genres,
    airingSchedule,
    studioConnections,
    studio,
    tagConnections,
    tag,
    scoreDistribution,
    statusDistribution,
    links,
    otherTitles,
    otherDescriptions,
    images,
    videos,
    screenshots,
    artworks,
    chronology,
    recommendations,
    characterConnections,
    character,
    characterName,
    characterImage,
    voiceActors,
    voiceName,
    voiceImage,
    episodes
  };
}

export type Loaders = ReturnType<typeof createLoaders>;
