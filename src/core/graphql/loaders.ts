import DataLoader from 'dataloader';
import {
  db,
  media,
  mediaTitle,
  mediaStartDate,
  mediaEndDate,
  mediaPoster,
  mediaGenre,
  mediaToGenre,
  mediaAiringSchedule,
  mediaCharacter,
  mediaCharacterName,
  mediaCharacterImage,
  mediaToCharacter,
  characterToVoiceActor,
  mediaVoiceActor,
  mediaVoiceName,
  mediaVoiceImage,
  mediaStudio,
  mediaToStudio,
  mediaTag,
  mediaToTag,
  mediaScoreDistribution,
  mediaStatusDistribution,
  mediaLink,
  mediaToLink,
  mediaAltTitle,
  mediaToAltTitle,
  mediaAltDescription,
  mediaToAltDescription,
  mediaImage,
  mediaToImage,
  mediaVideo,
  mediaToVideo,
  mediaScreenshot,
  mediaToScreenshot,
  mediaArtwork,
  mediaToArtwork,
  mediaChronology,
  mediaRecommendation,
  mediaEpisode,
  mediaEpisodeImage,
  mediaCharacterBirthDate,
  mediaVoiceDeathDate,
  mediaVoiceBirthDate,
  mediaTranslation,
  mediaToTranslation,
  mediaLatestAiringEpisode,
  mediaNextAiringEpisode,
  mediaLastAiringEpisode,
  mediaBroadcast,
  mediaAgeRating,
  mediaLocalScoreDistribution,
  mediaLocalStatusDistribution,
  mediaRelation,
  mediaEmbedding
} from 'src/db';
import { eq, inArray, asc, desc, sql, and, exists, not } from 'drizzle-orm';
import { groupBy, indexBy } from 'src/helpers/utils';

export function createLoaders() {
  const poster = new DataLoader<number, typeof mediaPoster.$inferSelect | null>(
    async (ids) => {
      const rows = await db
        .select()
        .from(mediaPoster)
        .where(inArray(mediaPoster.media_id, [...ids]));
      const map = indexBy(rows, (r) => r.media_id);
      return ids.map((id) => map.get(id) ?? null);
    },
    { cache: true }
  );

  const title = new DataLoader<number, typeof mediaTitle.$inferSelect | null>(
    async (ids) => {
      const rows = await db
        .select()
        .from(mediaTitle)
        .where(inArray(mediaTitle.media_id, [...ids]));
      const map = indexBy(rows, (r) => r.media_id);
      return ids.map((id) => map.get(id) ?? null);
    },
    { cache: true }
  );

  const startDate = new DataLoader<number, typeof mediaStartDate.$inferSelect | null>(
    async (ids) => {
      const rows = await db
        .select()
        .from(mediaStartDate)
        .where(inArray(mediaStartDate.media_id, [...ids]));
      const map = indexBy(rows, (r) => r.media_id);
      return ids.map((id) => map.get(id) ?? null);
    },
    { cache: true }
  );

  const endDate = new DataLoader<number, typeof mediaEndDate.$inferSelect | null>(
    async (ids) => {
      const rows = await db
        .select()
        .from(mediaEndDate)
        .where(inArray(mediaEndDate.media_id, [...ids]));
      const map = indexBy(rows, (r) => r.media_id);
      return ids.map((id) => map.get(id) ?? null);
    },
    { cache: true }
  );

  const broadcast = new DataLoader<number, typeof mediaBroadcast.$inferSelect | null>(
    async (ids) => {
      const rows = await db
        .select()
        .from(mediaBroadcast)
        .where(inArray(mediaBroadcast.media_id, [...ids]));
      const map = indexBy(rows, (r) => r.media_id);
      return ids.map((id) => map.get(id) ?? null);
    },
    { cache: true }
  );

  const ageRating = new DataLoader<number, typeof mediaAgeRating.$inferSelect | null>(
    async (ids) => {
      const rows = await db
        .select()
        .from(mediaAgeRating)
        .where(inArray(mediaAgeRating.media_id, [...ids]));
      const map = indexBy(rows, (r) => r.media_id);
      return ids.map((id) => map.get(id) ?? null);
    },
    { cache: true }
  );

  const genres = new DataLoader<number, (typeof mediaGenre.$inferSelect)[]>(
    async (ids) => {
      const rows = await db
        .select({ media_id: mediaToGenre.A, genre: mediaGenre })
        .from(mediaToGenre)
        .innerJoin(mediaGenre, eq(mediaToGenre.B, mediaGenre.id))
        .where(inArray(mediaToGenre.A, [...ids]))
        .orderBy(asc(mediaGenre.name));
      const map = groupBy(rows, (r) => r.media_id);
      return ids.map((id) => (map.get(id) ?? []).map((r) => r.genre));
    },
    { cache: true }
  );

  const airingSchedule = new DataLoader<number, (typeof mediaAiringSchedule.$inferSelect)[]>(
    async (ids) => {
      const rows = await db
        .select()
        .from(mediaAiringSchedule)
        .where(inArray(mediaAiringSchedule.media_id, [...ids]))
        .orderBy(asc(mediaAiringSchedule.episode));
      const map = groupBy(rows, (r) => r.media_id);
      return ids.map((id) => (map.get(id) ?? []).map((r) => r));
    },
    { cache: true }
  );

  const latestAiringEpisode = new DataLoader<number, typeof mediaLatestAiringEpisode.$inferSelect | null>(
    async (ids) => {
      const rows = await db
        .select()
        .from(mediaLatestAiringEpisode)
        .where(inArray(mediaLatestAiringEpisode.media_id, [...ids]));
      const map = indexBy(rows, (r) => r.media_id);
      return ids.map((id) => map.get(id) ?? null);
    },
    { cache: true }
  );

  const nextAiringEpisode = new DataLoader<number, typeof mediaNextAiringEpisode.$inferSelect | null>(
    async (ids) => {
      const rows = await db
        .select()
        .from(mediaNextAiringEpisode)
        .where(inArray(mediaNextAiringEpisode.media_id, [...ids]));
      const map = indexBy(rows, (r) => r.media_id);
      return ids.map((id) => map.get(id) ?? null);
    },
    { cache: true }
  );

  const lastAiringEpisode = new DataLoader<number, typeof mediaLastAiringEpisode.$inferSelect | null>(
    async (ids) => {
      const rows = await db
        .select()
        .from(mediaLastAiringEpisode)
        .where(inArray(mediaLastAiringEpisode.media_id, [...ids]));
      const map = indexBy(rows, (r) => r.media_id);
      return ids.map((id) => map.get(id) ?? null);
    },
    { cache: true }
  );

  const studioConnections = new DataLoader<number, (typeof mediaToStudio.$inferSelect)[]>(
    async (ids) => {
      const rows = (
        await db
          .select({ connection: mediaToStudio })
          .from(mediaToStudio)
          .innerJoin(mediaStudio, eq(mediaStudio.id, mediaToStudio.studio_id))
          .where(inArray(mediaToStudio.media_id, [...ids]))
          .orderBy(desc(mediaToStudio.is_main), asc(mediaStudio.name))
      ).map((r) => r.connection);
      const map = groupBy(rows, (r) => r.media_id);
      return ids.map((id) => map.get(id) ?? []);
    },
    { cache: true }
  );

  const studio = new DataLoader<number, typeof mediaStudio.$inferSelect | null>(
    async (ids) => {
      const rows = await db
        .select()
        .from(mediaStudio)
        .where(inArray(mediaStudio.id, [...ids]));
      const map = indexBy(rows, (r) => r.id);
      return ids.map((id) => map.get(id) ?? null);
    },
    {
      cache: true
    }
  );

  const tagConnections = new DataLoader<number, (typeof mediaToTag.$inferSelect)[]>(
    async (ids) => {
      const rows = (
        await db
          .select({ connnection: mediaToTag })
          .from(mediaToTag)
          .innerJoin(mediaTag, eq(mediaTag.id, mediaToTag.tag_id))
          .where(inArray(mediaToTag.media_id, [...ids]))
          .orderBy(desc(mediaToTag.rank), asc(mediaTag.name))
      ).map((r) => r.connnection);
      const map = groupBy(rows, (r) => r.media_id);
      return ids.map((id) => map.get(id) ?? []);
    },
    { cache: true }
  );

  const tag = new DataLoader<number, typeof mediaTag.$inferSelect | null>(
    async (ids) => {
      const rows = await db
        .select()
        .from(mediaTag)
        .where(inArray(mediaTag.id, [...ids]));
      const map = indexBy(rows, (r) => r.id);
      return ids.map((id) => map.get(id) ?? null);
    },
    {
      cache: true
    }
  );

  const scoreDistribution = new DataLoader<number, (typeof mediaScoreDistribution.$inferSelect)[]>(
    async (ids) => {
      const rows = await db
        .select()
        .from(mediaScoreDistribution)
        .where(inArray(mediaScoreDistribution.media_id, [...ids]))
        .orderBy(asc(mediaScoreDistribution.score));
      const map = groupBy(rows, (r) => r.media_id);
      return ids.map((id) => map.get(id) ?? []);
    },
    { cache: true }
  );

  const statusDistribution = new DataLoader<number, (typeof mediaStatusDistribution.$inferSelect)[]>(
    async (ids) => {
      const rows = await db
        .select()
        .from(mediaStatusDistribution)
        .where(inArray(mediaStatusDistribution.media_id, [...ids]))
        .orderBy(asc(mediaStatusDistribution.status));
      const map = groupBy(rows, (r) => r.media_id);
      return ids.map((id) => map.get(id) ?? []);
    },
    { cache: true }
  );

  const localScoreDistribution = new DataLoader<number, (typeof mediaLocalScoreDistribution.$inferSelect)[]>(
    async (ids) => {
      const rows = await db
        .select()
        .from(mediaLocalScoreDistribution)
        .where(inArray(mediaLocalScoreDistribution.media_id, [...ids]))
        .orderBy(asc(mediaLocalScoreDistribution.score));
      const map = groupBy(rows, (r) => r.media_id);
      return ids.map((id) => map.get(id) ?? []);
    },
    { cache: true }
  );

  const localStatusDistribution = new DataLoader<number, (typeof mediaLocalStatusDistribution.$inferSelect)[]>(
    async (ids) => {
      const rows = await db
        .select()
        .from(mediaLocalStatusDistribution)
        .where(inArray(mediaLocalStatusDistribution.media_id, [...ids]))
        .orderBy(asc(mediaLocalStatusDistribution.status));
      const map = groupBy(rows, (r) => r.media_id);
      return ids.map((id) => map.get(id) ?? []);
    },
    { cache: true }
  );

  const links = new DataLoader<number, (typeof mediaLink.$inferSelect)[]>(
    async (ids) => {
      const rows = await db
        .select({ media_id: mediaToLink.A, link: mediaLink })
        .from(mediaToLink)
        .innerJoin(mediaLink, eq(mediaToLink.B, mediaLink.id))
        .where(inArray(mediaToLink.A, [...ids]))
        .orderBy(asc(mediaLink.label));
      const map = groupBy(rows, (r) => r.media_id);
      return ids.map((id) => (map.get(id) ?? []).map((r) => r.link));
    },
    { cache: true }
  );

  const altTitles = new DataLoader<number, (typeof mediaAltTitle.$inferSelect)[]>(
    async (ids) => {
      const rows = await db
        .select({ media_id: mediaToAltTitle.A, title: mediaAltTitle })
        .from(mediaToAltTitle)
        .innerJoin(mediaAltTitle, eq(mediaToAltTitle.B, mediaAltTitle.id))
        .where(inArray(mediaToAltTitle.A, [...ids]))
        .orderBy(asc(mediaAltTitle.source), asc(mediaAltTitle.language));
      const map = groupBy(rows, (r) => r.media_id);
      return ids.map((id) => (map.get(id) ?? []).map((r) => r.title));
    },
    { cache: true }
  );

  const altDescriptions = new DataLoader<number, (typeof mediaAltDescription.$inferSelect)[]>(
    async (ids) => {
      const rows = await db
        .select({ media_id: mediaToAltDescription.A, description: mediaAltDescription })
        .from(mediaToAltDescription)
        .innerJoin(mediaAltDescription, eq(mediaToAltDescription.B, mediaAltDescription.id))
        .where(inArray(mediaToAltDescription.A, [...ids]))
        .orderBy(asc(mediaAltDescription.source), asc(mediaAltDescription.language));
      const map = groupBy(rows, (r) => r.media_id);
      return ids.map((id) => (map.get(id) ?? []).map((r) => r.description));
    },
    { cache: true }
  );

  const images = new DataLoader<number, (typeof mediaImage.$inferSelect)[]>(
    async (ids) => {
      const rows = await db
        .select({ media_id: mediaToImage.A, image: mediaImage })
        .from(mediaToImage)
        .innerJoin(mediaImage, eq(mediaToImage.B, mediaImage.id))
        .where(inArray(mediaToImage.A, [...ids]))
        .orderBy(asc(mediaImage.type), asc(mediaImage.source));
      const map = groupBy(rows, (r) => r.media_id);
      return ids.map((id) => (map.get(id) ?? []).map((r) => r.image));
    },
    { cache: true }
  );

  const videos = new DataLoader<number, (typeof mediaVideo.$inferSelect)[]>(
    async (ids) => {
      const rows = await db
        .select({ media_id: mediaToVideo.A, video: mediaVideo })
        .from(mediaToVideo)
        .innerJoin(mediaVideo, eq(mediaToVideo.B, mediaVideo.id))
        .where(inArray(mediaToVideo.A, [...ids]))
        .orderBy(asc(mediaVideo.type), asc(mediaVideo.title));
      const map = groupBy(rows, (r) => r.media_id);
      return ids.map((id) => (map.get(id) ?? []).map((r) => r.video));
    },
    { cache: true }
  );

  const screenshots = new DataLoader<number, (typeof mediaScreenshot.$inferSelect)[]>(
    async (ids) => {
      const rows = await db
        .select({ media_id: mediaToScreenshot.A, screenshot: mediaScreenshot })
        .from(mediaToScreenshot)
        .innerJoin(mediaScreenshot, eq(mediaToScreenshot.B, mediaScreenshot.id))
        .where(inArray(mediaToScreenshot.A, [...ids]))
        .orderBy(asc(mediaScreenshot.order));
      const map = groupBy(rows, (r) => r.media_id);
      return ids.map((id) => (map.get(id) ?? []).map((r) => r.screenshot));
    },
    { cache: true }
  );

  const artworks = new DataLoader<number, (typeof mediaArtwork.$inferSelect)[]>(
    async (ids) => {
      const rows = await db
        .select({ media_id: mediaToArtwork.A, artwork: mediaArtwork })
        .from(mediaToArtwork)
        .innerJoin(mediaArtwork, eq(mediaToArtwork.B, mediaArtwork.id))
        .where(inArray(mediaToArtwork.A, [...ids]))
        .orderBy(asc(mediaArtwork.type), asc(mediaArtwork.iso_639_1));
      const map = groupBy(rows, (r) => r.media_id);
      return ids.map((id) => (map.get(id) ?? []).map((r) => r.artwork));
    },
    { cache: true }
  );

  const translations = new DataLoader<number, (typeof mediaTranslation.$inferSelect)[]>(
    async (ids) => {
      const rows = await db
        .select({ media_id: mediaToTranslation.A, translation: mediaTranslation })
        .from(mediaToTranslation)
        .innerJoin(mediaTranslation, eq(mediaToTranslation.B, mediaTranslation.id))
        .where(inArray(mediaToTranslation.A, [...ids]))
        .orderBy(asc(mediaTranslation.iso_639_1), asc(mediaTranslation.title));
      const map = groupBy(rows, (r) => r.media_id);
      return ids.map((id) => (map.get(id) ?? []).map((r) => r.translation));
    },
    { cache: true }
  );

  const chronology = new DataLoader<number, (typeof media.$inferSelect)[]>(
    async (ids) => {
      const entries = await db
        .select()
        .from(mediaChronology)
        .where(inArray(mediaChronology.media_id, [...ids]))
        .orderBy(asc(mediaChronology.order));

      const relatedIds = [...new Set(entries.map((e) => e.related_id))];
      if (!relatedIds.length) return ids.map(() => []);

      const mediaRows = (
        await db
          .select({ a: media })
          .from(media)
          .innerJoin(mediaChronology, eq(mediaChronology.related_id, media.id_mal))
          .where(inArray(media.id_mal, relatedIds))
          .orderBy(asc(mediaChronology.order))
      ).map((r) => r.a);
      const mediaByMalId = indexBy(mediaRows, (a) => a.id_mal!);
      const entriesByMediaId = groupBy(entries, (e) => e.media_id);

      return ids.map((id) =>
        (entriesByMediaId.get(id) ?? [])
          .map((e) => mediaByMalId.get(e.related_id))
          .filter((a): a is typeof media.$inferSelect => !!a)
      );
    },
    { cache: true }
  );

  const recommendations = new DataLoader<number, (typeof media.$inferSelect)[]>(
    async (ids) => {
      const entries = await db
        .select()
        .from(mediaRecommendation)
        .where(inArray(mediaRecommendation.media_id, [...ids]))
        .orderBy(asc(mediaRecommendation.order));

      const relatedIds = [...new Set(entries.map((e) => e.related_id))];
      if (!relatedIds.length) return ids.map(() => []);

      const mediaRows = await db.select().from(media).where(inArray(media.id, relatedIds));
      const mediaById = indexBy(mediaRows, (r) => r.id);
      const entriesByMediaId = groupBy(entries, (e) => e.media_id);

      return ids.map((id) =>
        (entriesByMediaId.get(id) ?? [])
          .map((e) => mediaById.get(e.related_id))
          .filter((a): a is typeof media.$inferSelect => !!a)
      );
    },
    { cache: true }
  );

  const connected = new DataLoader<string, (typeof media.$inferSelect)[]>(
    async (ids) => {
      const rows = (
        await db
          .select({ a: media })
          .from(media)
          .leftJoin(mediaStartDate, eq(mediaStartDate.media_id, media.id))
          .where(inArray(media.franchise, [...ids]))
          .orderBy(
            sql`${mediaStartDate.year} ASC NULLS LAST`,
            sql`${mediaStartDate.month} ASC NULLS LAST`,
            sql`${mediaStartDate.day} ASC NULLS LAST`
          )
      )
        .map((r) => r.a)
        .filter((a) => Boolean(a.franchise));
      const map = groupBy(rows, (r) => r.franchise!);

      return ids.map((id) => map.get(id) ?? []);
    },
    { cache: true }
  );

  const characterConnections = new DataLoader<number, (typeof mediaToCharacter.$inferSelect)[]>(
    async (ids) => {
      const rows = await db
        .select()
        .from(mediaToCharacter)
        .where(inArray(mediaToCharacter.media_id, [...ids]))
        .orderBy(asc(mediaToCharacter.role_i), asc(mediaToCharacter.character_id));
      const map = groupBy(rows, (r) => r.media_id);
      return ids.map((id) => map.get(id) ?? []);
    },
    { cache: true }
  );

  const character = new DataLoader<number, typeof mediaCharacter.$inferSelect | null>(
    async (ids) => {
      const rows = await db
        .select()
        .from(mediaCharacter)
        .where(inArray(mediaCharacter.id, [...ids]));
      const map = indexBy(rows, (r) => r.id);
      return ids.map((id) => map.get(id) ?? null);
    },
    { cache: true }
  );

  const characterBirthDate = new DataLoader<number, typeof mediaCharacterBirthDate.$inferSelect | null>(
    async (ids) => {
      const rows = await db
        .select()
        .from(mediaCharacterBirthDate)
        .where(inArray(mediaCharacterBirthDate.character_id, [...ids]));
      const map = indexBy(rows, (r) => r.character_id!);
      return ids.map((id) => map.get(id) ?? null);
    },
    { cache: true }
  );

  const characterName = new DataLoader<number, typeof mediaCharacterName.$inferSelect | null>(
    async (ids) => {
      const rows = await db
        .select()
        .from(mediaCharacterName)
        .where(inArray(mediaCharacterName.character_id, [...ids]));
      const map = indexBy(rows, (r) => r.character_id!);
      return ids.map((id) => map.get(id) ?? null);
    },
    { cache: true }
  );

  const characterImage = new DataLoader<number, typeof mediaCharacterImage.$inferSelect | null>(
    async (ids) => {
      const rows = await db
        .select()
        .from(mediaCharacterImage)
        .where(inArray(mediaCharacterImage.character_id, [...ids]));
      const map = indexBy(rows, (r) => r.character_id!);
      return ids.map((id) => map.get(id) ?? null);
    },
    { cache: true }
  );

  const voiceActors = new DataLoader<number, (typeof mediaVoiceActor.$inferSelect)[]>(
    async (ids) => {
      const rows = await db
        .select({ connection_id: characterToVoiceActor.A, voiceActor: mediaVoiceActor })
        .from(characterToVoiceActor)
        .innerJoin(mediaVoiceActor, eq(characterToVoiceActor.B, mediaVoiceActor.id))
        .where(inArray(characterToVoiceActor.A, [...ids]))
        .orderBy(asc(mediaVoiceActor.language));
      const map = groupBy(rows, (r) => r.connection_id);
      return ids.map((id) => (map.get(id) ?? []).map((r) => r.voiceActor));
    },
    { cache: true }
  );

  const voiceBirthDate = new DataLoader<number, typeof mediaVoiceBirthDate.$inferSelect | null>(
    async (ids) => {
      const rows = await db
        .select()
        .from(mediaVoiceBirthDate)
        .where(inArray(mediaVoiceBirthDate.voice_actor_id, [...ids]));
      const map = indexBy(rows, (r) => r.voice_actor_id!);
      return ids.map((id) => map.get(id) ?? null);
    },
    { cache: true }
  );

  const voiceDeathDate = new DataLoader<number, typeof mediaVoiceDeathDate.$inferSelect | null>(
    async (ids) => {
      const rows = await db
        .select()
        .from(mediaVoiceDeathDate)
        .where(inArray(mediaVoiceDeathDate.voice_actor_id, [...ids]));
      const map = indexBy(rows, (r) => r.voice_actor_id!);
      return ids.map((id) => map.get(id) ?? null);
    },
    { cache: true }
  );

  const voiceName = new DataLoader<number, typeof mediaVoiceName.$inferSelect | null>(
    async (ids) => {
      const rows = await db
        .select()
        .from(mediaVoiceName)
        .where(inArray(mediaVoiceName.voice_actor_id, [...ids]));
      const map = indexBy(rows, (r) => r.voice_actor_id!);
      return ids.map((id) => map.get(id) ?? null);
    },
    { cache: true }
  );

  const voiceImage = new DataLoader<number, typeof mediaVoiceImage.$inferSelect | null>(
    async (ids) => {
      const rows = await db
        .select()
        .from(mediaVoiceImage)
        .where(inArray(mediaVoiceImage.voice_actor_id, [...ids]));
      const map = indexBy(rows, (r) => r.voice_actor_id!);
      return ids.map((id) => map.get(id) ?? null);
    },
    { cache: true }
  );

  const episodes = new DataLoader<number, (typeof mediaEpisode.$inferSelect)[]>(
    async (ids) => {
      const rows = await db
        .select()
        .from(mediaEpisode)
        .where(inArray(mediaEpisode.media_id, [...ids]))
        .orderBy(asc(mediaEpisode.number));
      const map = groupBy(rows, (r) => r.media_id);
      return ids.map((id) => map.get(id) ?? []);
    },
    {
      cache: true
    }
  );

  const episodeImage = new DataLoader<string, typeof mediaEpisodeImage.$inferSelect | null>(
    async (ids) => {
      const rows = await db
        .select()
        .from(mediaEpisodeImage)
        .where(inArray(mediaEpisodeImage.episode_id, [...ids]));
      const map = indexBy(rows, (r) => r.episode_id!);
      return ids.map((id) => map.get(id) ?? null);
    },
    {
      cache: true
    }
  );

  const relations = new DataLoader<number, (typeof mediaRelation.$inferSelect)[]>(
    async (ids) => {
      const rows = await db
        .select()
        .from(mediaRelation)
        .where(
          and(
            inArray(mediaRelation.media_id, [...ids]),
            exists(db.select().from(media).where(eq(media.id, mediaRelation.related_id)))
          )
        )
        .orderBy(asc(mediaRelation.relation_type));
      const map = groupBy(rows, (r) => r.media_id);
      return ids.map((id) => map.get(id) ?? []);
    },
    {
      cache: true
    }
  );

  const mediaInfo = new DataLoader<number, typeof media.$inferSelect | null>(
    async (ids) => {
      const rows = await db
        .select()
        .from(media)
        .where(inArray(media.id, [...ids]));
      const map = indexBy(rows, (r) => r.id);
      return ids.map((id) => map.get(id) ?? null);
    },
    {
      cache: true
    }
  );

  const recommendations_ai = new DataLoader<number, (typeof media.$inferSelect)[]>(
    async (ids) => {
      const embeddings = await db
        .select()
        .from(mediaEmbedding)
        .where(inArray(mediaEmbedding.media_id, [...ids]));

      const results = await Promise.all(
        embeddings.map(async ({ embedding }) => {
          const similar = await db
            .select({ media: media })
            .from(media)
            .innerJoin(mediaEmbedding, eq(mediaEmbedding.media_id, media.id))
            .where(sql`${mediaEmbedding.embedding} <=> ${JSON.stringify(embedding)}::vector BETWEEN 0.1 AND 0.5`)
            .orderBy(sql`${mediaEmbedding.embedding} <=> ${JSON.stringify(embedding)}::vector ASC`)
            .limit(10);

          return similar.map((s) => s.media);
        })
      );

      return ids.map((id) => {
        const idx = embeddings.findIndex((e) => e.media_id === id);
        return idx !== -1 ? (results[idx] ?? []) : [];
      });
    },
    { cache: true }
  );

  return {
    poster,
    title,
    startDate,
    endDate,
    broadcast,
    ageRating,
    genres,
    airingSchedule,
    latestAiringEpisode,
    nextAiringEpisode,
    lastAiringEpisode,
    studioConnections,
    studio,
    tagConnections,
    tag,
    scoreDistribution,
    statusDistribution,
    localScoreDistribution,
    localStatusDistribution,
    links,
    altTitles,
    altDescriptions,
    images,
    videos,
    screenshots,
    artworks,
    translations,
    chronology,
    recommendations,
    recommendations_ai,
    connected,
    characterConnections,
    character,
    characterBirthDate,
    characterName,
    characterImage,
    voiceActors,
    voiceBirthDate,
    voiceDeathDate,
    voiceName,
    voiceImage,
    episodes,
    episodeImage,
    relations,
    mediaInfo
  };
}

export type Loaders = ReturnType<typeof createLoaders>;
