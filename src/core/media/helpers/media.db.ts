import { Module } from 'src/helpers/module';
import { Config } from 'src/config';
import {
  media,
  mediaTitle,
  mediaPoster,
  mediaStartDate,
  mediaEndDate,
  mediaGenre,
  mediaToGenre,
  mediaAiringSchedule,
  mediaCharacter,
  mediaCharacterName,
  mediaCharacterImage,
  mediaVoiceActor,
  mediaVoiceName,
  mediaVoiceImage,
  mediaToCharacter,
  characterToVoiceActor,
  mediaStudio,
  mediaToStudio,
  mediaTag,
  mediaToTag,
  mediaScoreDistribution,
  mediaStatusDistribution,
  db,
  cleanPayload,
  mediaLink,
  mediaToLink,
  mediaArtwork,
  mediaToArtwork,
  mediaImage,
  mediaToImage,
  mediaScreenshot,
  mediaToScreenshot,
  mediaVideo,
  mediaToVideo,
  mediaAltTitle,
  mediaToAltTitle,
  mediaAltDescription,
  mediaToAltDescription,
  mediaChronology,
  mediaRecommendation,
  mediaEpisode,
  mediaEpisodeImage,
  mediaCharacterBirthDate,
  mediaVoiceBirthDate,
  mediaVoiceDeathDate,
  mediaTranslation,
  mediaToTranslation,
  mediaLatestAiringEpisode,
  mediaNextAiringEpisode,
  mediaLastAiringEpisode,
  mediaBroadcast,
  mediaAgeRating,
  mediaRelation
} from 'src/db';
import { eq, sql } from 'drizzle-orm';
import { toArray, uniqueBy } from 'src/helpers/utils';
import { MediaPayload } from '../types';
import { isForced } from 'src/helpers/forced';
import { getKey } from 'src/helpers/redis.util';

class MediaDbModule extends Module {
  override readonly name = 'MediaDB';

  async upsert(payload: MediaPayload) {
    const now = Math.floor(Date.now() / 1000);

    const hasSchedule = payload.airing_schedule !== undefined;

    const airedEpisodes = toArray(payload.airing_schedule)
      .filter((schedule) => schedule.airing_at && schedule.airing_at < now)
      .sort((a, b) => b.airing_at! - a.airing_at!);

    const futureEpisodes = toArray(payload.airing_schedule)
      .filter((schedule) => schedule.airing_at && schedule.airing_at > now)
      .sort((a, b) => a.airing_at! - b.airing_at!);

    const latestEpisode = airedEpisodes?.[0];
    const nextEpisode = futureEpisodes?.[0];
    const lastEpisode = toArray(payload.airing_schedule).sort((a, b) => (b.episode ?? 0) - (a.episode ?? 0))[0];

    const start_week =
      payload.start_date && payload.start_date.year && payload.start_date.month && payload.start_date.day
        ? new Date(payload.start_date.year, payload.start_date.month - 1, payload.start_date.day).getDay()
        : null;

    const air_week = nextEpisode?.airing_at ? new Date(nextEpisode.airing_at * 1000).getDay() : start_week;

    await db.transaction(async (tx) => {
      const { values, set } = cleanPayload({
        ...payload,
        air_week: hasSchedule ? air_week : undefined
      });

      await tx.insert(media).values(values).onConflictDoUpdate({
        target: media.id,
        set
      });

      const ops: Promise<any>[] = [];

      // Title
      if (payload.title) {
        ops.push(
          tx
            .insert(mediaTitle)
            .values({
              media_id: payload.id,
              romaji: payload.title.romaji,
              english: payload.title.english,
              native: payload.title.native
            })
            .onConflictDoUpdate({
              target: mediaTitle.media_id,
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
            .insert(mediaPoster)
            .values({
              media_id: payload.id,
              small: payload.poster.small,
              medium: payload.poster.medium,
              large: payload.poster.large
            })
            .onConflictDoUpdate({
              target: mediaPoster.media_id,
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
            .insert(mediaStartDate)
            .values({
              media_id: payload.id,
              year: payload.start_date.year,
              month: payload.start_date.month,
              day: payload.start_date.day
            })
            .onConflictDoUpdate({
              target: mediaStartDate.media_id,
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
            .insert(mediaEndDate)
            .values({
              media_id: payload.id,
              year: payload.end_date.year,
              month: payload.end_date.month,
              day: payload.end_date.day
            })
            .onConflictDoUpdate({
              target: mediaEndDate.media_id,
              set: {
                year: sql`excluded.year`,
                month: sql`excluded.month`,
                day: sql`excluded.day`
              }
            })
        );
      }

      // Broadcast
      if (payload.broadcast) {
        ops.push(
          tx
            .insert(mediaBroadcast)
            .values({
              media_id: payload.id,
              week: payload.broadcast.week,
              time: payload.broadcast.time,
              timezone: payload.broadcast.timezone
            })
            .onConflictDoUpdate({
              target: mediaEndDate.media_id,
              set: {
                week: sql`excluded.week`,
                time: sql`excluded.time`,
                timezone: sql`excluded.timezone`
              }
            })
        );
      }

      // Age Rating
      if (payload.age_rating) {
        ops.push(
          tx
            .insert(mediaAgeRating)
            .values({
              media_id: payload.id,
              rating: payload.age_rating.rating,
              description: payload.age_rating.description
            })
            .onConflictDoUpdate({
              target: mediaEndDate.media_id,
              set: {
                rating: sql`excluded.rating`,
                description: sql`excluded.description`
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
              .insert(mediaGenre)
              .values(genres)
              .onConflictDoUpdate({ target: mediaGenre.name, set: { name: sql`excluded.name` } })
              .returning({ id: mediaGenre.id });

            if (isForced(payload.genres)) {
              await tx.delete(mediaToGenre).where(eq(mediaToGenre.A, payload.id));
            }

            if (inserted.length) {
              await tx
                .insert(mediaToGenre)
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
            const schedule = uniqueBy(toArray(payload.airing_schedule), (a) => a.episode)
              .filter((a) => a.episode)
              .map((a) => ({
                media_id: payload.id,
                episode: a.episode,
                airing_at: a.airing_at
              }));

            if (!schedule.length) return;

            if (isForced(payload.airing_schedule)) {
              await tx.delete(mediaAiringSchedule).where(eq(mediaAiringSchedule.media_id, payload.id));
            }

            await tx
              .insert(mediaAiringSchedule)
              .values(schedule)
              .onConflictDoUpdate({
                target: [mediaAiringSchedule.media_id, mediaAiringSchedule.episode],
                set: {
                  airing_at: sql`excluded.airing_at`
                }
              });
          })
        );
      }

      if (hasSchedule) {
        ops.push(
          Promise.resolve().then(async () => {
            if (latestEpisode) {
              await tx
                .insert(mediaLatestAiringEpisode)
                .values({
                  media_id: payload.id,
                  episode: latestEpisode.episode,
                  airing_at: latestEpisode.airing_at
                })
                .onConflictDoUpdate({
                  target: mediaLatestAiringEpisode.media_id,
                  set: {
                    episode: sql`excluded.episode`,
                    airing_at: sql`excluded.airing_at`
                  }
                });
            } else {
              await tx.delete(mediaLatestAiringEpisode).where(eq(mediaLatestAiringEpisode.media_id, payload.id));
            }

            if (nextEpisode) {
              await tx
                .insert(mediaNextAiringEpisode)
                .values({
                  media_id: payload.id,
                  episode: nextEpisode.episode,
                  airing_at: nextEpisode.airing_at
                })
                .onConflictDoUpdate({
                  target: mediaNextAiringEpisode.media_id,
                  set: {
                    episode: sql`excluded.episode`,
                    airing_at: sql`excluded.airing_at`
                  }
                });
            } else {
              await tx.delete(mediaNextAiringEpisode).where(eq(mediaNextAiringEpisode.media_id, payload.id));
            }

            if (lastEpisode) {
              await tx
                .insert(mediaLastAiringEpisode)
                .values({
                  media_id: payload.id,
                  episode: lastEpisode.episode,
                  airing_at: lastEpisode.airing_at
                })
                .onConflictDoUpdate({
                  target: mediaLastAiringEpisode.media_id,
                  set: {
                    episode: sql`excluded.episode`,
                    airing_at: sql`excluded.airing_at`
                  }
                });
            } else {
              await tx.delete(mediaLastAiringEpisode).where(eq(mediaLastAiringEpisode.media_id, payload.id));
            }
          })
        );
      }

      // Characters
      if (toArray(payload.characters).length) {
        ops.push(
          Promise.resolve().then(async () => {
            if (isForced(payload.characters)) {
              await tx.delete(mediaToCharacter).where(eq(mediaToCharacter.media_id, payload.id));
            }

            const characters = uniqueBy(toArray(payload.characters), (e) => e.character?.id)
              .filter((c) => c.character?.id)
              .map((c) => ({
                id: c.character?.id!,
                age: c.character?.age,
                blood_type: c.character?.blood_type,
                gender: c.character?.gender,
                description: c.character?.description
              }));

            if (!characters.length) return;

            await tx
              .insert(mediaCharacter)
              .values(characters)
              .onConflictDoUpdate({
                target: mediaCharacter.id,
                set: {
                  age: sql`excluded.age`,
                  blood_type: sql`excluded.blood_type`,
                  gender: sql`excluded.gender`,
                  description: sql`excluded.description`
                }
              });

            const characterBirthDates = uniqueBy(toArray(payload.characters), (e) => e.character?.id)
              .filter((c) => c.character?.birth_date)
              .map((c) => ({
                character_id: c.character?.id!,
                day: c.character?.birth_date?.day,
                month: c.character?.birth_date?.month,
                year: c.character?.birth_date?.year
              }));

            if (characterBirthDates.length) {
              await tx
                .insert(mediaCharacterBirthDate)
                .values(characterBirthDates)
                .onConflictDoUpdate({
                  target: mediaCharacterBirthDate.character_id,
                  set: {
                    day: sql`excluded.day`,
                    month: sql`excluded.month`,
                    year: sql`excluded.year`
                  }
                });
            }

            const characterNames = uniqueBy(toArray(payload.characters), (e) => e.character?.id)
              .filter((c) => c.character?.name)
              .map((c) => ({
                character_id: c.character?.id,
                first: c.character?.name?.first,
                middle: c.character?.name?.middle,
                last: c.character?.name?.last,
                full: c.character?.name?.full,
                native: c.character?.name?.native,
                alternative: c.character?.name?.alternative || [],
                alternative_spoiler: c.character?.name?.alternative_spoiler || []
              }));

            if (characterNames.length) {
              await tx
                .insert(mediaCharacterName)
                .values(characterNames)
                .onConflictDoUpdate({
                  target: mediaCharacterName.character_id,
                  set: {
                    first: sql`excluded.first`,
                    middle: sql`excluded.middle`,
                    last: sql`excluded.last`,
                    full: sql`excluded.full`,
                    native: sql`excluded.native`,
                    alternative: sql`excluded.alternative`,
                    alternative_spoiler: sql`excluded.alternative_spoiler`
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
                .insert(mediaCharacterImage)
                .values(characterImages)
                .onConflictDoUpdate({
                  target: mediaCharacterImage.character_id,
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
              language: va.language,
              age: va.age,
              blood_type: va.blood_type,
              gender: va.gender,
              description: va.description,
              home_town: va.home_town
            }));

            if (allVoiceActors.length) {
              if (voiceActors.length) {
                await tx
                  .insert(mediaVoiceActor)
                  .values(voiceActors)
                  .onConflictDoUpdate({
                    target: mediaVoiceActor.id,
                    set: {
                      language: sql`excluded.language`,
                      age: sql`excluded.age`,
                      blood_type: sql`excluded.blood_type`,
                      gender: sql`excluded.gender`,
                      description: sql`excluded.description`,
                      home_town: sql`excluded.home_town`
                    }
                  });
              }

              const voiceBirthDates = uniqueBy(allVoiceActors, (a) => a.id)
                .filter((va) => va.birth_date)
                .map((va) => ({
                  voice_actor_id: va.id,
                  day: va.birth_date?.day,
                  month: va.birth_date?.month,
                  year: va.birth_date?.year
                }));

              if (voiceBirthDates.length) {
                await tx
                  .insert(mediaVoiceBirthDate)
                  .values(voiceBirthDates)
                  .onConflictDoUpdate({
                    target: mediaVoiceBirthDate.voice_actor_id,
                    set: { day: sql`excluded.day`, month: sql`excluded.month`, year: sql`excluded.year` }
                  });
              }

              const voiceDeathDates = uniqueBy(allVoiceActors, (a) => a.id)
                .filter((va) => va.death_date)
                .map((va) => ({
                  voice_actor_id: va.id,
                  day: va.death_date?.day,
                  month: va.death_date?.month,
                  year: va.death_date?.year
                }));

              if (voiceDeathDates.length) {
                await tx
                  .insert(mediaVoiceDeathDate)
                  .values(voiceDeathDates)
                  .onConflictDoUpdate({
                    target: mediaVoiceDeathDate.voice_actor_id,
                    set: { day: sql`excluded.day`, month: sql`excluded.month`, year: sql`excluded.year` }
                  });
              }

              const voiceNames = uniqueBy(allVoiceActors, (a) => a.id)
                .filter((va) => va.name)
                .map((va) => ({
                  voice_actor_id: va.id,
                  first: va.name?.first,
                  middle: va.name?.middle,
                  last: va.name?.last,
                  full: va.name?.full,
                  native: va.name?.native,
                  alternative: va.name?.alternative || []
                }));

              if (voiceNames.length) {
                await tx
                  .insert(mediaVoiceName)
                  .values(voiceNames)
                  .onConflictDoUpdate({
                    target: mediaVoiceName.voice_actor_id,
                    set: {
                      first: sql`excluded.first`,
                      middle: sql`excluded.middle`,
                      last: sql`excluded.last`,
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
                  .insert(mediaVoiceImage)
                  .values(voiceImages)
                  .onConflictDoUpdate({
                    target: mediaVoiceImage.voice_actor_id,
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
                role_i: c.role_i,
                media_id: payload.id,
                character_id: c.character?.id!
              }));

            if (characterConnections.length) {
              await tx
                .insert(mediaToCharacter)
                .values(characterConnections)
                .onConflictDoUpdate({
                  target: mediaToCharacter.id,
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
              .insert(mediaStudio)
              .values(studios)
              .onConflictDoUpdate({
                target: mediaStudio.id,
                set: { name: sql`excluded.name` }
              });

            if (isForced(payload.studios)) {
              await tx.delete(mediaToStudio).where(eq(mediaToStudio.media_id, payload.id));
            }

            const studioConnections = uniqueBy(toArray(payload.studios), (c) => c.id)
              .filter((c) => c.studio?.id)
              .map((c) => ({
                id: c.id,
                is_main: c.is_main,
                media_id: payload.id,
                studio_id: c.studio?.id!
              }));

            if (studioConnections.length) {
              await tx
                .insert(mediaToStudio)
                .values(studioConnections)
                .onConflictDoUpdate({
                  target: mediaToStudio.id,
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
              .insert(mediaTag)
              .values(tags)
              .onConflictDoUpdate({
                target: mediaTag.id,
                set: {
                  name: sql`excluded.name`,
                  description: sql`excluded.description`,
                  category: sql`excluded.category`,
                  is_adult: sql`excluded.is_adult`
                }
              });

            if (isForced(payload.tags)) {
              await tx.delete(mediaToTag).where(eq(mediaToTag.media_id, payload.id));
            }

            const tagConnections = uniqueBy(toArray(payload.tags), (c) => c.tag?.id)
              .filter((c) => c.tag?.id)
              .map((c) => ({
                media_id: payload.id,
                tag_id: c.tag?.id!,
                rank: c.rank,
                is_spoiler: c.is_spoiler
              }));

            if (tagConnections.length) {
              await tx
                .insert(mediaToTag)
                .values(tagConnections)
                .onConflictDoUpdate({
                  target: [mediaToTag.media_id, mediaToTag.tag_id],
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
            const links = uniqueBy(toArray(payload.links), (l) => getKey(l.link, l.label))
              .filter((l) => l.link && l.label)
              .map((l) => ({
                link: l?.link!,
                label: l?.label.toLowerCase(),
                type: l?.type
              }));

            if (!links.length) return;

            const inserted = await tx
              .insert(mediaLink)
              .values(links)
              .onConflictDoUpdate({
                target: [mediaLink.link, mediaLink.label],
                set: {
                  link: sql`excluded.link`,
                  label: sql`excluded.label`,
                  type: sql`excluded.type`
                }
              })
              .returning({ id: mediaLink.id });

            if (isForced(payload.links)) {
              await tx.delete(mediaToLink).where(eq(mediaToLink.A, payload.id));
            }

            if (inserted.length) {
              await tx
                .insert(mediaToLink)
                .values(inserted.map((i) => ({ A: payload.id, B: i.id })))
                .onConflictDoNothing();
            }
          })
        );
      }

      // Score Distribution
      if (toArray(payload.score_distribution).length) {
        if (isForced(payload.score_distribution)) {
          await tx.delete(mediaScoreDistribution).where(eq(mediaScoreDistribution.media_id, payload.id));
        }

        const scoreDist = uniqueBy(toArray(payload.score_distribution), (dist) => dist.score)
          .filter((dist) => dist.score)
          .map((dist) => ({
            media_id: payload.id,
            score: dist.score,
            amount: dist.amount
          }));

        if (scoreDist.length) {
          ops.push(
            tx
              .insert(mediaScoreDistribution)
              .values(scoreDist)
              .onConflictDoUpdate({
                target: [mediaScoreDistribution.media_id, mediaScoreDistribution.score],
                set: { amount: sql`excluded.amount` }
              })
          );
        }
      }

      // Status Distribution
      if (toArray(payload.status_distribution).length) {
        if (isForced(payload.status_distribution)) {
          await tx.delete(mediaStatusDistribution).where(eq(mediaStatusDistribution.media_id, payload.id));
        }

        const statusDist = uniqueBy(toArray(payload.status_distribution), (dist) => dist.status)
          .filter((dist) => dist.status)
          .map((dist) => ({
            media_id: payload.id,
            status: dist.status,
            amount: dist.amount
          }));

        if (statusDist.length) {
          ops.push(
            tx
              .insert(mediaStatusDistribution)
              .values(statusDist)
              .onConflictDoUpdate({
                target: [mediaStatusDistribution.media_id, mediaStatusDistribution.status],
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
                is_adult: a.is_adult,
                width: a.width,
                source: a.source.toLowerCase()
              }));

            if (!artworks.length) return;

            const inserted = await tx
              .insert(mediaArtwork)
              .values(artworks)
              .onConflictDoUpdate({
                target: [mediaArtwork.url, mediaArtwork.source],
                set: {
                  height: sql`excluded.height`,
                  width: sql`excluded.width`,
                  large: sql`excluded.large`,
                  medium: sql`excluded.medium`,
                  is_adult: sql`excluded.is_adult`,
                  iso_639_1: sql`excluded.iso_639_1`
                }
              })
              .returning({ id: mediaArtwork.id });

            if (isForced(payload.artworks)) {
              await tx.delete(mediaToArtwork).where(eq(mediaToArtwork.A, payload.id));
            }

            if (inserted.length) {
              await tx
                .insert(mediaToArtwork)
                .values(inserted.map((i) => ({ A: payload.id, B: i.id })))
                .onConflictDoNothing();
            }
          })
        );
      }

      // Translations
      if (toArray(payload.translations).length) {
        ops.push(
          Promise.resolve().then(async () => {
            const translations = uniqueBy(toArray(payload.translations), (a) =>
              getKey(a.iso_639_1, a.title, a.source)
            )
              .filter((a) => a.title && a.iso_639_1 && a.source)
              .map((a) => ({
                iso_639_1: a.iso_639_1,
                title: a.title,
                description: a.description,
                tagline: a.tagline,
                source: a.source.toLowerCase()
              }));

            if (!translations.length) return;

            const inserted = await tx
              .insert(mediaTranslation)
              .values(translations)
              .onConflictDoUpdate({
                target: [mediaTranslation.iso_639_1, mediaTranslation.title, mediaTranslation.source],
                set: {
                  description: sql`excluded.description`,
                  tagline: sql`excluded.tagline`
                }
              })
              .returning({ id: mediaTranslation.id });

            if (isForced(payload.translations)) {
              await tx.delete(mediaToTranslation).where(eq(mediaToTranslation.A, payload.id));
            }

            if (inserted.length) {
              await tx
                .insert(mediaToTranslation)
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
              .insert(mediaImage)
              .values(images)
              .onConflictDoUpdate({
                target: [mediaImage.url, mediaImage.source],
                set: {
                  small: sql`excluded.small`,
                  medium: sql`excluded.medium`,
                  large: sql`excluded.large`
                }
              })
              .returning({ id: mediaImage.id });

            if (isForced(payload.images)) {
              await tx.delete(mediaToImage).where(eq(mediaToImage.A, payload.id));
            }

            if (inserted.length) {
              await tx
                .insert(mediaToImage)
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
              .insert(mediaScreenshot)
              .values(screenshots)
              .onConflictDoUpdate({
                target: [mediaScreenshot.url, mediaScreenshot.source],
                set: {
                  order: sql`excluded.order`,
                  small: sql`excluded.small`,
                  medium: sql`excluded.medium`,
                  large: sql`excluded.large`
                }
              })
              .returning({ id: mediaScreenshot.id });

            if (isForced(payload.screenshots)) {
              await tx.delete(mediaToScreenshot).where(eq(mediaToScreenshot.A, payload.id));
            }

            if (inserted.length) {
              await tx
                .insert(mediaToScreenshot)
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
              .insert(mediaVideo)
              .values(videos)
              .onConflictDoUpdate({
                target: [mediaVideo.url, mediaVideo.source],
                set: {
                  title: sql`excluded.title`,
                  thumbnail: sql`excluded.thumbnail`,
                  artist: sql`excluded.artist`,
                  type: sql`excluded.type`
                }
              })
              .returning({ id: mediaVideo.id });

            if (isForced(payload.videos)) {
              await tx.delete(mediaToVideo).where(eq(mediaToVideo.A, payload.id));
            }

            if (inserted.length) {
              await tx
                .insert(mediaToVideo)
                .values(inserted.map((i) => ({ A: payload.id, B: i.id })))
                .onConflictDoNothing();
            }
          })
        );
      }

      // Other Titles
      if (toArray(payload.alt_titles).length) {
        ops.push(
          Promise.resolve().then(async () => {
            const titles = uniqueBy(toArray(payload.alt_titles), (t) => getKey(t.title, t.source))
              .filter((t) => t.title && t.source)
              .map((t) => ({
                title: t.title,
                source: t.source.toLowerCase(),
                language: t.language
              }));

            if (!titles.length) return;

            const inserted = await tx
              .insert(mediaAltTitle)
              .values(titles)
              .onConflictDoNothing({
                target: [mediaAltTitle.title, mediaAltTitle.source]
              })
              .returning({ id: mediaAltTitle.id });

            if (isForced(payload.alt_titles)) {
              await tx.delete(mediaToAltTitle).where(eq(mediaToAltTitle.A, payload.id));
            }

            if (inserted.length) {
              await tx
                .insert(mediaToAltTitle)
                .values(inserted.map((i) => ({ A: payload.id, B: i.id })))
                .onConflictDoNothing();
            }
          })
        );
      }

      // Other Descriptions
      if (toArray(payload.alt_descriptions).length) {
        ops.push(
          Promise.resolve().then(async () => {
            const descriptions = uniqueBy(toArray(payload.alt_descriptions), (d) =>
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
              .insert(mediaAltDescription)
              .values(descriptions)
              .onConflictDoNothing({
                target: [mediaAltDescription.description, mediaAltDescription.source]
              })
              .returning({ id: mediaAltDescription.id });

            if (isForced(payload.alt_descriptions)) {
              await tx.delete(mediaToAltDescription).where(eq(mediaToAltDescription.A, payload.id));
            }

            if (inserted.length) {
              await tx
                .insert(mediaToAltDescription)
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
                media_id: payload.id,
                parent_id: c.parent_id,
                related_id: c.related_id,
                order: c.order
              }));

            if (!chronology.length) return;

            if (isForced(payload.chronology)) {
              await tx.delete(mediaChronology).where(eq(mediaChronology.media_id, payload.id));
            }

            await tx
              .insert(mediaChronology)
              .values(chronology)
              .onConflictDoUpdate({
                target: [mediaChronology.parent_id, mediaChronology.related_id],
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
                media_id: payload.id,
                parent_id: c.parent_id,
                related_id: c.related_id,
                order: c.order
              }));

            if (!recommendations.length) return;

            if (isForced(payload.recommendations)) {
              await tx.delete(mediaRecommendation).where(eq(mediaRecommendation.media_id, payload.id));
            }

            await tx
              .insert(mediaRecommendation)
              .values(recommendations)
              .onConflictDoUpdate({
                target: [mediaRecommendation.parent_id, mediaRecommendation.related_id],
                set: { order: sql`excluded.order` }
              });
          })
        );
      }

      // Related
      if (toArray(payload.related).length) {
        ops.push(
          Promise.resolve().then(async () => {
            const related = uniqueBy(toArray(payload.related), (c) => getKey(c.parent_id, c.related_id))
              .filter((c) => c.parent_id && c.related_id)
              .map((c) => ({
                media_id: payload.id,
                parent_id: c.parent_id,
                related_id: c.related_id,
                relation_type: c.relation_type
              }));

            if (!related.length) return;

            if (isForced(payload.related)) {
              await tx.delete(mediaRelation).where(eq(mediaRelation.media_id, payload.id));
            }

            await tx
              .insert(mediaRelation)
              .values(related)
              .onConflictDoUpdate({
                target: [mediaRelation.parent_id, mediaRelation.related_id],
                set: { relation_type: sql`excluded.relation_type` }
              });
          })
        );
      }

      // Episodes
      if (toArray(payload.episodes).length) {
        ops.push(
          Promise.resolve().then(async () => {
            const episodes = uniqueBy(toArray(payload.episodes), (e) => e.number).map((e) => ({
              title: e.title,
              number: e.number,
              air_date: e.air_date,
              runtime: e.runtime,
              overview: e.overview,
              media_id: payload.id
            }));

            if (!episodes.length) return;

            if (isForced(payload.episodes)) {
              await tx.delete(mediaEpisode).where(eq(mediaEpisode.media_id, payload.id));
            }

            const inserted = await tx
              .insert(mediaEpisode)
              .values(episodes)
              .onConflictDoUpdate({
                target: [mediaEpisode.media_id, mediaEpisode.number],
                set: {
                  title: sql`excluded.title`,
                  number: sql`excluded.number`,
                  air_date: sql`excluded.air_date`,
                  runtime: sql`excluded.runtime`,
                  overview: sql`excluded.overview`
                }
              })
              .returning({ id: mediaEpisode.id, number: mediaEpisode.number });

            const episodeImages = uniqueBy(toArray(payload.episodes), (e) => e.number)
              .filter((e) => e.image)
              .map((e, i) => ({
                episode_id: inserted.find((i) => i.number === e.number)?.id,
                small: e.image?.small,
                medium: e.image?.medium,
                large: e.image?.large
              }))
              .filter((e) => e.episode_id);

            if (episodeImages.length) {
              await tx
                .insert(mediaEpisodeImage)
                .values(episodeImages)
                .onConflictDoUpdate({
                  target: mediaEpisodeImage.episode_id,
                  set: {
                    small: sql`excluded.small`,
                    medium: sql`excluded.medium`,
                    large: sql`excluded.large`
                  }
                });
            }
          })
        );
      }

      for (let i = 0; i < ops.length; i += Config.transaction_batch) {
        await Promise.all(ops.slice(i, i + Config.transaction_batch));
      }
    });
  }
}

const MediaDb = new MediaDbModule();

export { MediaDb, MediaDbModule };
