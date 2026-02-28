import { DateUtils } from 'src/helpers/date';
import { Module } from 'src/helpers/module';
import { Config } from 'src/config/config';
import {
  anime,
  animeTitle,
  animePoster,
  animeStartDate,
  animeEndDate,
  animeGenre,
  animeToGenre,
  animeAiringSchedule,
  animeCharacter,
  animeCharacterName,
  animeCharacterImage,
  animeVoiceActor,
  animeVoiceName,
  animeVoiceImage,
  animeToCharacter,
  characterToVoiceActor,
  animeStudio,
  animeToStudio,
  animeTag,
  animeToTag,
  animeScoreDistribution,
  animeStatusDistribution,
  db,
  cleanPayload,
  animeToAiringSchedule,
  animeLink,
  animeToLink,
  animeArtwork,
  animeToArtwork,
  animeImage,
  animeToImage,
  animeScreenshot,
  animeToScreenshot,
  animeVideo,
  animeToVideo,
  animeOtherTitle,
  animeToOtherTitle,
  animeOtherDescription,
  animeToOtherDescription,
  animeChronology,
  animeRecommendation
} from 'src/db';
import { eq, sql } from 'drizzle-orm';
import { toArray, uniqueBy } from 'src/helpers/utils';
import { AnimePayload } from '../types';
import { isForced } from 'src/helpers/forced';
import { getKey } from 'src/helpers/redis.util';

class AnimeDbModule extends Module {
  override readonly name = 'AnimeDB';

  async upsert(payload: AnimePayload) {
    const airedEpisodes = toArray(payload.airing_schedule)
      .filter((schedule) => DateUtils.isPast(schedule.airing_at ?? 0))
      .sort((a, b) => (b.airing_at ?? 0) - (a.airing_at ?? 0));

    const futureEpisodes = toArray(payload.airing_schedule)
      .filter((schedule) => DateUtils.isFuture(schedule.airing_at ?? 0))
      .sort((a, b) => (b.airing_at ?? 0) - (a.airing_at ?? 0));

    const latestEpisode = airedEpisodes?.[0];
    const nextEpisode = futureEpisodes?.[0];
    const lastEpisode = toArray(payload.airing_schedule).sort((a, b) => (b.episode ?? 0) - (a.episode ?? 0))[0];

    await db.transaction(async (tx) => {
      const { values, set } = cleanPayload({
        ...payload,
        latest_airing_episode: latestEpisode?.airing_at,
        next_airing_episode: nextEpisode?.airing_at,
        last_airing_episode: lastEpisode?.airing_at
      });

      await tx.insert(anime).values(values).onConflictDoUpdate({
        target: anime.id,
        set
      });

      const ops: Promise<any>[] = [];

      // Title
      if (payload.title) {
        ops.push(
          tx
            .insert(animeTitle)
            .values({
              anime_id: payload.id,
              romaji: payload.title.romaji,
              english: payload.title.english,
              native: payload.title.native
            })
            .onConflictDoUpdate({
              target: animeTitle.anime_id,
              set: {
                romaji: sql`excluded.romaji`,
                english: sql`excluded.english`,
                native: sql`excluded.native`
              }
            })
        );
      }

      // Poster
      if (payload.poster) {
        ops.push(
          tx
            .insert(animePoster)
            .values({
              anime_id: payload.id,
              small: payload.poster.small,
              medium: payload.poster.medium,
              large: payload.poster.large
            })
            .onConflictDoUpdate({
              target: animePoster.anime_id,
              set: {
                small: sql`excluded.small`,
                medium: sql`excluded.medium`,
                large: sql`excluded.large`
              }
            })
        );
      }

      // Start Date
      if (payload.start_date) {
        ops.push(
          tx
            .insert(animeStartDate)
            .values({
              anime_id: payload.id,
              year: payload.start_date.year,
              month: payload.start_date.month,
              day: payload.start_date.day
            })
            .onConflictDoUpdate({
              target: animeStartDate.anime_id,
              set: {
                year: sql`excluded.year`,
                month: sql`excluded.month`,
                day: sql`excluded.day`
              }
            })
        );
      }

      // End Date
      if (payload.end_date) {
        ops.push(
          tx
            .insert(animeEndDate)
            .values({
              anime_id: payload.id,
              year: payload.end_date.year,
              month: payload.end_date.month,
              day: payload.end_date.day
            })
            .onConflictDoUpdate({
              target: animeEndDate.anime_id,
              set: {
                year: sql`excluded.year`,
                month: sql`excluded.month`,
                day: sql`excluded.day`
              }
            })
        );
      }

      // Genres
      if (toArray(payload.genres).length) {
        ops.push(
          Promise.resolve().then(async () => {
            const genres = uniqueBy(toArray(payload.genres), (g) => g.name)
              .filter((g) => g.name)
              .map((g) => ({ name: g.name! }));

            if (!genres.length) return;

            const inserted = await tx
              .insert(animeGenre)
              .values(genres)
              .onConflictDoUpdate({ target: animeGenre.name, set: { name: sql`excluded.name` } })
              .returning({ id: animeGenre.id });

            if (isForced(payload.genres)) {
              await tx.delete(animeToGenre).where(eq(animeToGenre.A, payload.id));
            }

            if (inserted.length) {
              await tx
                .insert(animeToGenre)
                .values(inserted.map((genre) => ({ A: payload.id, B: genre.id })))
                .onConflictDoNothing();
            }
          })
        );
      }

      // Airing Schedule
      if (toArray(payload.airing_schedule).length) {
        ops.push(
          Promise.resolve().then(async () => {
            const schedule = uniqueBy(toArray(payload.airing_schedule), (a) => a.id)
              .filter((a) => a.id)
              .map((a) => ({
                id: a.id,
                episode: a.episode,
                airing_at: a.airing_at
              }));

            if (!schedule.length) return;

            const inserted = await tx
              .insert(animeAiringSchedule)
              .values(schedule)
              .onConflictDoUpdate({
                target: animeAiringSchedule.id,
                set: {
                  episode: sql`excluded.episode`,
                  airing_at: sql`excluded.airing_at`
                }
              })
              .returning({ id: animeAiringSchedule.id });

            if (isForced(payload.airing_schedule)) {
              await tx.delete(animeToAiringSchedule).where(eq(animeToAiringSchedule.A, payload.id));
            }

            if (inserted.length) {
              await tx
                .insert(animeToAiringSchedule)
                .values(inserted.map((i) => ({ A: payload.id, B: i.id })))
                .onConflictDoNothing();
            }
          })
        );
      }

      // Characters
      if (toArray(payload.characters).length) {
        ops.push(
          Promise.resolve().then(async () => {
            if (isForced(payload.characters)) {
              await tx.delete(animeToCharacter).where(eq(animeToCharacter.anime_id, payload.id));
            }

            const characters = uniqueBy(toArray(payload.characters), (e) => e.character?.id)
              .filter((c) => c.character?.id)
              .map((c) => ({ id: c.character?.id! }));

            if (!characters.length) return;

            await tx.insert(animeCharacter).values(characters).onConflictDoNothing({ target: animeCharacter.id });

            const characterNames = uniqueBy(toArray(payload.characters), (e) => e.character?.id)
              .filter((c) => c.character?.name)
              .map((c) => ({
                character_id: c.character?.id,
                full: c.character?.name?.full,
                native: c.character?.name?.native,
                alternative: c.character?.name?.alternative || []
              }));

            if (characterNames.length) {
              await tx
                .insert(animeCharacterName)
                .values(characterNames)
                .onConflictDoUpdate({
                  target: animeCharacterName.character_id,
                  set: {
                    full: sql`excluded.full`,
                    native: sql`excluded.native`,
                    alternative: sql`excluded.alternative`
                  }
                });
            }

            const characterImages = uniqueBy(toArray(payload.characters), (e) => e.character?.id)
              .filter((c) => c.character?.image)
              .map((c) => ({
                character_id: c.character?.id,
                large: c.character?.image?.large,
                medium: c.character?.image?.medium
              }));

            if (characterImages.length) {
              await tx
                .insert(animeCharacterImage)
                .values(characterImages)
                .onConflictDoUpdate({
                  target: animeCharacterImage.character_id,
                  set: {
                    large: sql`excluded.large`,
                    medium: sql`excluded.medium`
                  }
                });
            }

            const allVoiceActors = uniqueBy(toArray(payload.characters), (e) => e.character?.id).flatMap(
              (c) => c.voice_actors ?? []
            );

            const voiceActors = uniqueBy(allVoiceActors, (a) => a.id).map((va) => ({
              id: va.id,
              language: va.language
            }));

            if (allVoiceActors.length) {
              if (voiceActors.length) {
                await tx
                  .insert(animeVoiceActor)
                  .values(voiceActors)
                  .onConflictDoUpdate({
                    target: animeVoiceActor.id,
                    set: { language: sql`excluded.language` }
                  });
              }

              const voiceNames = uniqueBy(allVoiceActors, (a) => a.id)
                .filter((va) => va.name)
                .map((va) => ({
                  voice_actor_id: va.id,
                  full: va.name?.full,
                  native: va.name?.native,
                  alternative: va.name?.alternative || []
                }));

              if (voiceNames.length) {
                await tx
                  .insert(animeVoiceName)
                  .values(voiceNames)
                  .onConflictDoUpdate({
                    target: animeVoiceName.voice_actor_id,
                    set: {
                      full: sql`excluded.full`,
                      native: sql`excluded.native`,
                      alternative: sql`excluded.alternative`
                    }
                  });
              }

              const voiceImages = uniqueBy(allVoiceActors, (a) => a.id)
                .filter((va) => va.image)
                .map((va) => ({
                  voice_actor_id: va.id,
                  large: va.image?.large,
                  medium: va.image?.medium
                }));

              if (voiceImages.length) {
                await tx
                  .insert(animeVoiceImage)
                  .values(voiceImages)
                  .onConflictDoUpdate({
                    target: animeVoiceImage.voice_actor_id,
                    set: {
                      large: sql`excluded.large`,
                      medium: sql`excluded.medium`
                    }
                  });
              }
            }

            const characterConnections = uniqueBy(toArray(payload.characters), (e) => e.id)
              .filter((c) => c.character?.id)
              .map((c) => ({
                id: c.id,
                role: c.role,
                anime_id: payload.id,
                character_id: c.character?.id!
              }));

            if (characterConnections.length) {
              await tx
                .insert(animeToCharacter)
                .values(characterConnections)
                .onConflictDoUpdate({
                  target: animeToCharacter.id,
                  set: { role: sql`excluded.role` }
                });
            }

            const connectionsWithVoiceActors =
              toArray(payload.characters).filter((c) => c.voice_actors?.length) ?? [];

            for (const connection of connectionsWithVoiceActors) {
              await tx.delete(characterToVoiceActor).where(eq(characterToVoiceActor.A, connection.id));

              const vaValues = uniqueBy(connection.voice_actors ?? [], (a) => a.id).map((va) => ({
                A: connection.id,
                B: va.id
              }));

              if (vaValues.length) {
                await tx.insert(characterToVoiceActor).values(vaValues).onConflictDoNothing();
              }
            }
          })
        );
      }

      // Studios
      if (toArray(payload.studios).length) {
        ops.push(
          Promise.resolve().then(async () => {
            const studios = uniqueBy(toArray(payload.studios), (e) => e.studio?.id)
              .filter((c) => c.studio?.id)
              .map((c) => ({
                id: c.studio?.id!,
                name: c.studio?.name
              }));

            if (!studios.length) return;

            await tx
              .insert(animeStudio)
              .values(studios)
              .onConflictDoUpdate({
                target: animeStudio.id,
                set: { name: sql`excluded.name` }
              });

            if (isForced(payload.studios)) {
              await tx.delete(animeToStudio).where(eq(animeToStudio.anime_id, payload.id));
            }

            const studioConnections = uniqueBy(toArray(payload.studios), (c) => c.id)
              .filter((c) => c.studio?.id)
              .map((c) => ({
                id: c.id,
                is_main: c.is_main,
                anime_id: payload.id,
                studio_id: c.studio?.id!
              }));

            if (studioConnections.length) {
              await tx
                .insert(animeToStudio)
                .values(studioConnections)
                .onConflictDoUpdate({
                  target: animeToStudio.id,
                  set: {
                    is_main: sql`excluded.is_main`
                  }
                });
            }
          })
        );
      }

      // Tags
      if (toArray(payload.tags).length) {
        ops.push(
          Promise.resolve().then(async () => {
            const tags = uniqueBy(toArray(payload.tags), (c) => c.tag?.id)
              .filter((c) => c.tag?.id)
              .map((c) => ({
                id: c.tag?.id!,
                name: c.tag?.name,
                description: c.tag?.description,
                category: c.tag?.category,
                is_adult: c.tag?.is_adult
              }));

            if (!tags.length) return;

            await tx
              .insert(animeTag)
              .values(tags)
              .onConflictDoUpdate({
                target: animeTag.id,
                set: {
                  name: sql`excluded.name`,
                  description: sql`excluded.description`,
                  category: sql`excluded.category`,
                  is_adult: sql`excluded.is_adult`
                }
              });

            if (isForced(payload.tags)) {
              await tx.delete(animeToTag).where(eq(animeToTag.anime_id, payload.id));
            }

            const tagConnections = uniqueBy(toArray(payload.tags), (c) => c.tag?.id)
              .filter((c) => c.tag?.id)
              .map((c) => ({
                anime_id: payload.id,
                tag_id: c.tag?.id!,
                rank: c.rank,
                is_spoiler: c.is_spoiler
              }));

            if (tagConnections.length) {
              await tx
                .insert(animeToTag)
                .values(tagConnections)
                .onConflictDoUpdate({
                  target: [animeToTag.anime_id, animeToTag.tag_id],
                  set: {
                    rank: sql`excluded.rank`,
                    is_spoiler: sql`excluded.is_spoiler`
                  }
                });
            }
          })
        );
      }

      // Links
      if (toArray(payload.links).length) {
        ops.push(
          Promise.resolve().then(async () => {
            console.log(payload.links);

            const links = uniqueBy(toArray(payload.links), (l) => getKey(l.link, l.label))
              .filter((l) => l.link && l.label)
              .map((l) => ({
                link: l?.link!,
                label: l?.label.toLowerCase(),
                type: l?.type
              }));

            if (!links.length) return;

            const inserted = await tx
              .insert(animeLink)
              .values(links)
              .onConflictDoUpdate({
                target: [animeLink.link, animeLink.label],
                set: {
                  link: sql`excluded.link`,
                  label: sql`excluded.label`,
                  type: sql`excluded.type`
                }
              })
              .returning({ id: animeLink.id });

            if (isForced(payload.links)) {
              await tx.delete(animeToLink).where(eq(animeToLink.A, payload.id));
            }

            if (inserted.length) {
              await tx
                .insert(animeToLink)
                .values(inserted.map((i) => ({ A: payload.id, B: i.id })))
                .onConflictDoNothing();
            }
          })
        );
      }

      // Score Distribution
      if (toArray(payload.score_distribution).length) {
        if (isForced(payload.score_distribution)) {
          await tx.delete(animeScoreDistribution).where(eq(animeScoreDistribution.anime_id, payload.id));
        }

        const scoreDist = uniqueBy(toArray(payload.score_distribution), (dist) => dist.score)
          .filter((dist) => dist.score)
          .map((dist) => ({
            anime_id: payload.id,
            score: dist.score,
            amount: dist.amount
          }));

        if (scoreDist.length) {
          ops.push(
            tx
              .insert(animeScoreDistribution)
              .values(scoreDist)
              .onConflictDoUpdate({
                target: [animeScoreDistribution.anime_id, animeScoreDistribution.score],
                set: { amount: sql`excluded.amount` }
              })
          );
        }
      }

      // Status Distribution
      if (toArray(payload.status_distribution).length) {
        if (isForced(payload.status_distribution)) {
          await tx.delete(animeStatusDistribution).where(eq(animeStatusDistribution.anime_id, payload.id));
        }

        const statusDist = uniqueBy(toArray(payload.status_distribution), (dist) => dist.status)
          .filter((dist) => dist.status)
          .map((dist) => ({
            anime_id: payload.id,
            status: dist.status,
            amount: dist.amount
          }));

        if (statusDist.length) {
          ops.push(
            tx
              .insert(animeStatusDistribution)
              .values(statusDist)
              .onConflictDoUpdate({
                target: [animeStatusDistribution.anime_id, animeStatusDistribution.status],
                set: { amount: sql`excluded.amount` }
              })
          );
        }
      }

      // Artworks
      if (toArray(payload.artworks).length) {
        ops.push(
          Promise.resolve().then(async () => {
            const artworks = uniqueBy(toArray(payload.artworks), (a) => getKey(a.url, a.source))
              .filter((a) => a.url && a.source)
              .map((a) => ({
                url: a.url,
                height: a.height,
                large: a.large,
                iso_639_1: a.iso_639_1,
                medium: a.medium,
                type: a.type,
                width: a.width,
                source: a.source.toLowerCase()
              }));

            if (!artworks.length) return;

            const inserted = await tx
              .insert(animeArtwork)
              .values(artworks)
              .onConflictDoUpdate({
                target: [animeArtwork.url, animeArtwork.source],
                set: {
                  height: sql`excluded.height`,
                  width: sql`excluded.width`,
                  large: sql`excluded.large`,
                  medium: sql`excluded.medium`,
                  iso_639_1: sql`excluded.iso_639_1`
                }
              })
              .returning({ id: animeArtwork.id });

            if (isForced(payload.artworks)) {
              await tx.delete(animeToArtwork).where(eq(animeToArtwork.A, payload.id));
            }

            if (inserted.length) {
              await tx
                .insert(animeToArtwork)
                .values(inserted.map((i) => ({ A: payload.id, B: i.id })))
                .onConflictDoNothing();
            }
          })
        );
      }

      // Images
      if (toArray(payload.images).length) {
        ops.push(
          Promise.resolve().then(async () => {
            const images = uniqueBy(toArray(payload.images), (i) => getKey(i.url, i.source))
              .filter((i) => i.url && i.source)
              .map((i) => ({
                url: i.url,
                small: i.small,
                medium: i.medium,
                large: i.large,
                type: i.type,
                source: i.source.toLowerCase()
              }));

            if (!images.length) return;

            const inserted = await tx
              .insert(animeImage)
              .values(images)
              .onConflictDoUpdate({
                target: [animeImage.url, animeImage.source],
                set: {
                  small: sql`excluded.small`,
                  medium: sql`excluded.medium`,
                  large: sql`excluded.large`
                }
              })
              .returning({ id: animeImage.id });

            if (isForced(payload.images)) {
              await tx.delete(animeToImage).where(eq(animeToImage.A, payload.id));
            }

            if (inserted.length) {
              await tx
                .insert(animeToImage)
                .values(inserted.map((i) => ({ A: payload.id, B: i.id })))
                .onConflictDoNothing();
            }
          })
        );
      }

      // Screenshots
      if (toArray(payload.screenshots).length) {
        ops.push(
          Promise.resolve().then(async () => {
            const screenshots = uniqueBy(toArray(payload.screenshots), (s) => getKey(s.url, s.source))
              .filter((s) => s.url && s.source)
              .map((s) => ({
                url: s.url,
                order: s.order,
                small: s.small,
                medium: s.medium,
                large: s.large,
                source: s.source.toLowerCase()
              }));

            if (!screenshots.length) return;

            const inserted = await tx
              .insert(animeScreenshot)
              .values(screenshots)
              .onConflictDoUpdate({
                target: [animeScreenshot.url, animeScreenshot.source],
                set: {
                  order: sql`excluded.order`,
                  small: sql`excluded.small`,
                  medium: sql`excluded.medium`,
                  large: sql`excluded.large`
                }
              })
              .returning({ id: animeScreenshot.id });

            if (isForced(payload.screenshots)) {
              await tx.delete(animeToScreenshot).where(eq(animeToScreenshot.A, payload.id));
            }

            if (inserted.length) {
              await tx
                .insert(animeToScreenshot)
                .values(inserted.map((i) => ({ A: payload.id, B: i.id })))
                .onConflictDoNothing();
            }
          })
        );
      }

      // Videos
      if (toArray(payload.videos).length) {
        ops.push(
          Promise.resolve().then(async () => {
            const videos = uniqueBy(toArray(payload.videos), (v) => getKey(v.url, v.source))
              .filter((v) => v.url && v.source)
              .map((v) => ({
                url: v.url,
                title: v.title,
                thumbnail: v.thumbnail,
                artist: v.artist,
                type: v.type,
                source: v.source.toLowerCase()
              }));

            if (!videos.length) return;

            const inserted = await tx
              .insert(animeVideo)
              .values(videos)
              .onConflictDoUpdate({
                target: [animeVideo.url, animeVideo.source],
                set: {
                  title: sql`excluded.title`,
                  thumbnail: sql`excluded.thumbnail`,
                  artist: sql`excluded.artist`,
                  type: sql`excluded.type`
                }
              })
              .returning({ id: animeVideo.id });

            if (isForced(payload.videos)) {
              await tx.delete(animeToVideo).where(eq(animeToVideo.A, payload.id));
            }

            if (inserted.length) {
              await tx
                .insert(animeToVideo)
                .values(inserted.map((i) => ({ A: payload.id, B: i.id })))
                .onConflictDoNothing();
            }
          })
        );
      }

      // Other Titles
      if (toArray(payload.other_titles).length) {
        ops.push(
          Promise.resolve().then(async () => {
            const titles = uniqueBy(toArray(payload.other_titles), (t) => getKey(t.title, t.source))
              .filter((t) => t.title && t.source)
              .map((t) => ({
                title: t.title,
                source: t.source.toLowerCase(),
                language: t.language
              }));

            if (!titles.length) return;

            const inserted = await tx
              .insert(animeOtherTitle)
              .values(titles)
              .onConflictDoNothing({
                target: [animeOtherTitle.title, animeOtherTitle.source]
              })
              .returning({ id: animeOtherTitle.id });

            if (isForced(payload.other_titles)) {
              await tx.delete(animeToOtherTitle).where(eq(animeToOtherTitle.A, payload.id));
            }

            if (inserted.length) {
              await tx
                .insert(animeToOtherTitle)
                .values(inserted.map((i) => ({ A: payload.id, B: i.id })))
                .onConflictDoNothing();
            }
          })
        );
      }

      // Other Descriptions
      if (toArray(payload.other_descriptions).length) {
        ops.push(
          Promise.resolve().then(async () => {
            const descriptions = uniqueBy(toArray(payload.other_descriptions), (d) =>
              getKey(d.description, d.source)
            )
              .filter((d) => d.description && d.source)
              .map((d) => ({
                description: d.description,
                source: d.source.toLowerCase(),
                language: d.language
              }));

            if (!descriptions.length) return;

            const inserted = await tx
              .insert(animeOtherDescription)
              .values(descriptions)
              .onConflictDoNothing({
                target: [animeOtherDescription.description, animeOtherDescription.source]
              })
              .returning({ id: animeOtherDescription.id });

            if (isForced(payload.other_descriptions)) {
              await tx.delete(animeToOtherDescription).where(eq(animeToOtherDescription.A, payload.id));
            }

            if (inserted.length) {
              await tx
                .insert(animeToOtherDescription)
                .values(inserted.map((i) => ({ A: payload.id, B: i.id })))
                .onConflictDoNothing();
            }
          })
        );
      }

      // Chronology
      if (toArray(payload.chronology).length) {
        ops.push(
          Promise.resolve().then(async () => {
            const chronology = uniqueBy(toArray(payload.chronology), (c) => getKey(c.parent_id, c.related_id))
              .filter((c) => c.parent_id && c.related_id)
              .map((c) => ({
                anime_id: payload.id,
                parent_id: c.parent_id,
                related_id: c.related_id,
                order: c.order
              }));

            if (!chronology.length) return;

            if (isForced(payload.chronology)) {
              await tx.delete(animeChronology).where(eq(animeChronology.anime_id, payload.id));
            }

            await tx
              .insert(animeChronology)
              .values(chronology)
              .onConflictDoUpdate({
                target: [animeChronology.parent_id, animeChronology.related_id],
                set: { order: sql`excluded.order` }
              });
          })
        );
      }

      // Recommendations
      if (toArray(payload.recommendations).length) {
        ops.push(
          Promise.resolve().then(async () => {
            const recommendations = uniqueBy(toArray(payload.recommendations), (c) =>
              getKey(c.parent_id, c.related_id)
            )
              .filter((c) => c.parent_id && c.related_id)
              .map((c) => ({
                anime_id: payload.id,
                parent_id: c.parent_id,
                related_id: c.related_id,
                order: c.order
              }));

            if (!recommendations.length) return;

            if (isForced(payload.recommendations)) {
              await tx.delete(animeRecommendation).where(eq(animeRecommendation.anime_id, payload.id));
            }

            await tx
              .insert(animeRecommendation)
              .values(recommendations)
              .onConflictDoUpdate({
                target: [animeRecommendation.parent_id, animeRecommendation.related_id],
                set: { order: sql`excluded.order` }
              });
          })
        );
      }

      for (let i = 0; i < ops.length; i += Config.transaction_batch) {
        await Promise.all(ops.slice(i, i + Config.transaction_batch));
      }
    });
  }
}

const AnimeDb = new AnimeDbModule();

export { AnimeDb, AnimeDbModule };
