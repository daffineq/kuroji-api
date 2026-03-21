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
  animeRecommendation
} from 'src/db';
import { eq, inArray, asc, desc, and } from 'drizzle-orm';

// ─── helpers ────────────────────────────────────────────────────────────────

/** Group an array of rows by a key, returning a Map<key, Row[]>. */
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

/** Map an array of rows by a unique key, returning a Map<key, Row>. */
function indexBy<T>(rows: T[], key: (row: T) => number | string): Map<number | string, T> {
  const map = new Map<number | string, T>();
  for (const row of rows) map.set(key(row), row);
  return map;
}

// ─── loader factory ─────────────────────────────────────────────────────────

export function createLoaders() {
  // ----- single-row loaders (one record per anime_id) ----------------------

  const posterLoader = new DataLoader<number, typeof animePoster.$inferSelect | null>(
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

  const titleLoader = new DataLoader<number, typeof animeTitle.$inferSelect | null>(
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

  const startDateLoader = new DataLoader<number, typeof animeStartDate.$inferSelect | null>(
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

  const endDateLoader = new DataLoader<number, typeof animeEndDate.$inferSelect | null>(
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

  // ----- multi-row loaders (many records per anime_id) ---------------------

  const genresLoader = new DataLoader<number, (typeof animeGenre.$inferSelect)[]>(
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

  const airingScheduleLoader = new DataLoader<number, (typeof animeAiringSchedule.$inferSelect)[]>(
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

  const studiosLoader = new DataLoader<
    number,
    { is_main: boolean | null; studio: typeof animeStudio.$inferSelect }[]
  >(
    async (ids) => {
      const rows = await db
        .select({ anime_id: animeToStudio.anime_id, edge: animeToStudio, studio: animeStudio })
        .from(animeToStudio)
        .innerJoin(animeStudio, eq(animeToStudio.studio_id, animeStudio.id))
        .where(inArray(animeToStudio.anime_id, [...ids]))
        .orderBy(desc(animeToStudio.is_main), asc(animeStudio.name));
      const map = groupBy(rows, (r) => r.anime_id);
      return ids.map((id) => (map.get(id) ?? []).map((r) => ({ ...r.edge, studio: r.studio })));
    },
    { cache: true }
  );

  const tagsLoader = new DataLoader<
    number,
    { rank: number | null; is_spoiler: boolean | null; tag: typeof animeTag.$inferSelect }[]
  >(
    async (ids) => {
      const rows = await db
        .select({ anime_id: animeToTag.anime_id, edge: animeToTag, tag: animeTag })
        .from(animeToTag)
        .innerJoin(animeTag, eq(animeToTag.tag_id, animeTag.id))
        .where(inArray(animeToTag.anime_id, [...ids]))
        .orderBy(desc(animeToTag.rank), asc(animeTag.name));
      const map = groupBy(rows, (r) => r.anime_id);
      return ids.map((id) => (map.get(id) ?? []).map((r) => ({ ...r.edge, tag: r.tag })));
    },
    { cache: true }
  );

  const scoreDistributionLoader = new DataLoader<number, (typeof animeScoreDistribution.$inferSelect)[]>(
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

  const statusDistributionLoader = new DataLoader<number, (typeof animeStatusDistribution.$inferSelect)[]>(
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

  const linksLoader = new DataLoader<number, (typeof animeLink.$inferSelect)[]>(
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

  const otherTitlesLoader = new DataLoader<number, (typeof animeOtherTitle.$inferSelect)[]>(
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

  const otherDescriptionsLoader = new DataLoader<number, (typeof animeOtherDescription.$inferSelect)[]>(
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

  const imagesLoader = new DataLoader<number, (typeof animeImage.$inferSelect)[]>(
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

  const videosLoader = new DataLoader<number, (typeof animeVideo.$inferSelect)[]>(
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

  const screenshotsLoader = new DataLoader<number, (typeof animeScreenshot.$inferSelect)[]>(
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

  const artworksLoader = new DataLoader<number, (typeof animeArtwork.$inferSelect)[]>(
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

  const chronologyLoader = new DataLoader<number, (typeof anime.$inferSelect)[]>(
    async (ids) => {
      const entries = await db
        .select()
        .from(animeChronology)
        .where(inArray(animeChronology.anime_id, [...ids]))
        .orderBy(asc(animeChronology.order));

      const relatedIds = [...new Set(entries.map((e) => e.related_id))];
      if (!relatedIds.length) return ids.map(() => []);

      const animeRows = await db.select().from(anime).where(inArray(anime.id_mal, relatedIds));

      const animeByMalId = indexBy(animeRows, (r) => r.id_mal!);
      const entriesByAnimeId = groupBy(entries, (e) => e.anime_id);

      return ids.map((id) =>
        (entriesByAnimeId.get(id) ?? [])
          .map((e) => animeByMalId.get(e.related_id))
          .filter((a): a is typeof anime.$inferSelect => !!a)
      );
    },
    { cache: true }
  );

  const recommendationsLoader = new DataLoader<number, (typeof anime.$inferSelect)[]>(
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

  const charactersLoader = new DataLoader<number, any[]>(
    async (ids) => {
      const connections = await db
        .select({
          edge: animeToCharacter,
          character: animeCharacter,
          characterName: animeCharacterName,
          characterImage: animeCharacterImage
        })
        .from(animeToCharacter)
        .innerJoin(animeCharacter, eq(animeToCharacter.character_id, animeCharacter.id))
        .leftJoin(animeCharacterName, eq(animeCharacter.id, animeCharacterName.character_id))
        .leftJoin(animeCharacterImage, eq(animeCharacter.id, animeCharacterImage.character_id))
        .where(inArray(animeToCharacter.anime_id, [...ids]))
        .orderBy(asc(animeToCharacter.role), asc(animeToCharacter.character_id));

      const edgeIds = connections.map((c) => c.edge.id);
      const voiceActorRows =
        edgeIds.length > 0
          ? await db
              .select({
                edge_id: characterToVoiceActor.A,
                voiceActor: animeVoiceActor,
                voiceName: animeVoiceName,
                voiceImage: animeVoiceImage
              })
              .from(characterToVoiceActor)
              .innerJoin(animeVoiceActor, eq(characterToVoiceActor.B, animeVoiceActor.id))
              .leftJoin(animeVoiceName, eq(animeVoiceActor.id, animeVoiceName.voice_actor_id))
              .leftJoin(animeVoiceImage, eq(animeVoiceActor.id, animeVoiceImage.voice_actor_id))
              .where(inArray(characterToVoiceActor.A, edgeIds))
              .orderBy(asc(animeVoiceActor.language))
          : [];

      const vaByEdgeId = groupBy(voiceActorRows, (r) => r.edge_id);

      const assembled = connections.map((e) => ({
        ...e.edge,
        character: {
          ...e.character,
          name: e.characterName,
          image: e.characterImage
        },
        voice_actors: (vaByEdgeId.get(e.edge.id) ?? []).map((v) => ({
          ...v.voiceActor,
          name: v.voiceName,
          image: v.voiceImage
        }))
      }));

      const byAnimeId = groupBy(assembled, (r) => r.anime_id);
      return ids.map((id) => byAnimeId.get(id) ?? []);
    },
    { cache: true }
  );

  return {
    poster: posterLoader,
    title: titleLoader,
    startDate: startDateLoader,
    endDate: endDateLoader,
    genres: genresLoader,
    airingSchedule: airingScheduleLoader,
    characters: charactersLoader,
    studios: studiosLoader,
    tags: tagsLoader,
    scoreDistribution: scoreDistributionLoader,
    statusDistribution: statusDistributionLoader,
    links: linksLoader,
    otherTitles: otherTitlesLoader,
    otherDescriptions: otherDescriptionsLoader,
    images: imagesLoader,
    videos: videosLoader,
    screenshots: screenshotsLoader,
    artworks: artworksLoader,
    chronology: chronologyLoader,
    recommendations: recommendationsLoader
  };
}

export type Loaders = ReturnType<typeof createLoaders>;
