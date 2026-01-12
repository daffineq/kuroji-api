import { AnilistMedia } from '../providers/anilist/types';
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
  animeCharacterEdge,
  characterToVoiceActor,
  animeStudio,
  animeStudioEdge,
  animeTag,
  animeTagEdge,
  animeExternalLink,
  animeScoreDistribution,
  animeStatusDistribution,
  db,
  upsertWithExcluded
} from 'src/db';
import { eq, sql } from 'drizzle-orm';
import { uniqueBy } from 'src/helpers/utils';

class AnimeDbModule extends Module {
  override readonly name = 'AnimeDB';

  async upsert(anilist: AnilistMedia) {
    const airedEpisodes = anilist.airingSchedule?.edges
      .filter((schedule) => DateUtils.isPast(schedule.node.airingAt))
      .sort((a, b) => b.node.airingAt - a.node.airingAt);

    const futureEpisodes = anilist.airingSchedule?.edges
      .filter((schedule) => DateUtils.isFuture(schedule.node.airingAt))
      .sort((a, b) => a.node.airingAt - b.node.airingAt);

    const latestEpisode = airedEpisodes?.[0]?.node;
    const nextEpisode = futureEpisodes?.[0]?.node;
    const lastEpisode = [...(anilist.airingSchedule?.edges ?? [])].sort(
      (a, b) => (b.node.episode ?? 0) - (a.node.episode ?? 0)
    )[0]?.node;

    await db.transaction(async (tx) => {
      const { values, set } = upsertWithExcluded({
        id: anilist.id,
        id_mal: anilist.idMal,
        background: anilist.bannerImage,
        synonyms: anilist.synonyms ?? [],
        description: anilist.description,
        status: anilist.status,
        type: anilist.type,
        format: anilist.format,
        updated_at: Math.floor(Date.now() / 1000),
        season: anilist.season,
        season_year: anilist.seasonYear,
        episodes: anilist.episodes,
        duration: anilist.duration,
        country_of_origin: anilist.countryOfOrigin,
        is_licensed: anilist.isLicensed,
        source: anilist.source,
        hashtag: anilist.hashtag,
        is_adult: anilist.isAdult,
        score: anilist.meanScore,
        popularity: anilist.popularity,
        trending: anilist.trending,
        favorites: anilist.favourites,
        color: anilist.coverImage?.color,
        latest_airing_episode: latestEpisode?.airingAt,
        next_airing_episode: nextEpisode?.airingAt,
        last_airing_episode: lastEpisode?.airingAt
      });

      await tx.insert(anime).values(values).onConflictDoUpdate({
        target: anime.id,
        set
      });

      const ops: Promise<any>[] = [];

      // Title
      if (anilist.title) {
        ops.push(
          tx
            .insert(animeTitle)
            .values({
              anime_id: anilist.id,
              romaji: anilist.title.romaji,
              english: anilist.title.english,
              native: anilist.title.native
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
      if (anilist.coverImage) {
        ops.push(
          tx
            .insert(animePoster)
            .values({
              anime_id: anilist.id,
              medium: anilist.coverImage.medium,
              large: anilist.coverImage.large,
              extra_large: anilist.coverImage.extraLarge
            })
            .onConflictDoUpdate({
              target: animePoster.anime_id,
              set: {
                medium: sql`excluded.medium`,
                large: sql`excluded.large`,
                extra_large: sql`excluded.extra_large`
              }
            })
        );
      }

      // Start Date
      if (anilist.startDate) {
        ops.push(
          tx
            .insert(animeStartDate)
            .values({
              anime_id: anilist.id,
              year: anilist.startDate.year,
              month: anilist.startDate.month,
              day: anilist.startDate.day
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
      if (anilist.endDate) {
        ops.push(
          tx
            .insert(animeEndDate)
            .values({
              anime_id: anilist.id,
              year: anilist.endDate.year,
              month: anilist.endDate.month,
              day: anilist.endDate.day
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
      if (anilist.genres?.length) {
        ops.push(
          Promise.resolve().then(async () => {
            const inserted = await tx
              .insert(animeGenre)
              .values(uniqueBy(anilist.genres, (g) => g).map((name) => ({ name })))
              .onConflictDoUpdate({ target: animeGenre.name, set: { name: sql`excluded.name` } })
              .returning({ id: animeGenre.id, name: animeGenre.name });

            await tx.delete(animeToGenre).where(eq(animeToGenre.A, anilist.id));

            await tx
              .insert(animeToGenre)
              .values(
                inserted.map((genre) => ({
                  A: anilist.id,
                  B: genre.id
                }))
              )
              .onConflictDoNothing();
          })
        );
      }

      // Airing Schedule
      if (anilist.airingSchedule?.edges?.length) {
        ops.push(
          tx
            .insert(animeAiringSchedule)
            .values(
              uniqueBy(anilist.airingSchedule.edges, (e) => e.node.id).map((edge) => ({
                id: edge.node.id,
                episode: edge.node.episode,
                airing_at: edge.node.airingAt,
                anime_id: anilist.id
              }))
            )
            .onConflictDoUpdate({
              target: animeAiringSchedule.id,
              set: {
                episode: sql`excluded.episode`,
                airing_at: sql`excluded.airing_at`,
                anime_id: sql`excluded.anime_id`
              }
            })
        );
      }

      // Characters
      if (anilist.characters?.edges?.length) {
        ops.push(
          Promise.resolve().then(async () => {
            // Insert all characters
            await tx
              .insert(animeCharacter)
              .values(uniqueBy(anilist.characters.edges, (e) => e.node.id).map((edge) => ({ id: edge.node.id })))
              .onConflictDoNothing({ target: animeCharacter.id });

            // Insert character names
            const characterNames = uniqueBy(anilist.characters.edges, (e) => e.node.id)
              .filter((edge) => edge.node.name)
              .map((edge) => ({
                character_id: edge.node.id,
                full: edge.node.name.full,
                native: edge.node.name.native,
                alternative: edge.node.name.alternative || []
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

            // Insert character images
            const characterImages = uniqueBy(anilist.characters.edges, (e) => e.node.id)
              .filter((edge) => edge.node.image)
              .map((edge) => ({
                character_id: edge.node.id,
                large: edge.node.image?.large,
                medium: edge.node.image?.medium
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

            // Insert voice actors
            const allVoiceActors = uniqueBy(anilist.characters.edges, (e) => e.node.id).flatMap(
              (edge) => edge.voiceActors ?? []
            );

            if (allVoiceActors.length) {
              await tx
                .insert(animeVoiceActor)
                .values(
                  uniqueBy(allVoiceActors, (a) => a.id).map((va) => ({
                    id: va.id,
                    language: va.languageV2
                  }))
                )
                .onConflictDoUpdate({
                  target: animeVoiceActor.id,
                  set: { language: sql`excluded.language` }
                });

              // Insert voice actor names
              const voiceNames = uniqueBy(allVoiceActors, (a) => a.id)
                .filter((va) => va.name)
                .map((va) => ({
                  voice_actor_id: va.id,
                  full: va.name.full,
                  native: va.name.native,
                  alternative: va.name.alternative || []
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

              // Insert voice actor images
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

            // Insert character edges
            await tx
              .insert(animeCharacterEdge)
              .values(
                uniqueBy(anilist.characters.edges, (e) => e.id).map((edge) => ({
                  id: edge.id,
                  role: edge.role,
                  anime_id: anilist.id,
                  character_id: edge.node.id
                }))
              )
              .onConflictDoUpdate({
                target: animeCharacterEdge.id,
                set: {
                  role: sql`excluded.role`,
                  anime_id: sql`excluded.anime_id`,
                  character_id: sql`excluded.character_id`
                }
              });

            // Link characters to voice actors
            const edgesWithVoiceActors = anilist.characters.edges.filter((edge) => edge.voiceActors?.length);

            for (const edge of edgesWithVoiceActors) {
              await tx.delete(characterToVoiceActor).where(eq(characterToVoiceActor.A, edge.id));

              await tx
                .insert(characterToVoiceActor)
                .values(
                  uniqueBy(edge.voiceActors ?? [], (a) => a.id).map((va) => ({
                    A: edge.id,
                    B: va.id
                  })) ?? []
                )
                .onConflictDoNothing();
            }
          })
        );
      }

      // Studios
      if (anilist.studios?.edges?.length) {
        ops.push(
          Promise.resolve().then(async () => {
            await tx
              .insert(animeStudio)
              .values(
                uniqueBy(anilist.studios.edges, (e) => e.node.id).map((s) => ({
                  id: s.node.id,
                  name: s.node.name
                }))
              )
              .onConflictDoUpdate({
                target: animeStudio.id,
                set: { name: sql`excluded.name` }
              });

            await tx
              .insert(animeStudioEdge)
              .values(
                uniqueBy(anilist.studios.edges, (e) => e.id).map((edge) => ({
                  id: edge.id,
                  is_main: edge.isMain,
                  anime_id: anilist.id,
                  studio_id: edge.node.id
                }))
              )
              .onConflictDoUpdate({
                target: animeStudioEdge.id,
                set: {
                  is_main: sql`excluded.is_main`,
                  anime_id: sql`excluded.anime_id`,
                  studio_id: sql`excluded.studio_id`
                }
              });
          })
        );
      }

      // Tags
      if (anilist.tags?.length) {
        ops.push(
          Promise.resolve().then(async () => {
            await tx
              .insert(animeTag)
              .values(
                uniqueBy(anilist.tags, (t) => t.id).map((tag) => ({
                  id: tag.id,
                  name: tag.name,
                  description: tag.description,
                  category: tag.category,
                  is_general_spoiler: tag.isGeneralSpoiler,
                  is_adult: tag.isAdult
                }))
              )
              .onConflictDoUpdate({
                target: animeTag.id,
                set: {
                  name: sql`excluded.name`,
                  description: sql`excluded.description`,
                  category: sql`excluded.category`,
                  is_general_spoiler: sql`excluded.is_general_spoiler`,
                  is_adult: sql`excluded.is_adult`
                }
              });

            await tx
              .insert(animeTagEdge)
              .values(
                uniqueBy(anilist.tags, (t) => t.id).map((tag) => ({
                  anime_id: anilist.id,
                  tag_id: tag.id,
                  rank: tag.rank,
                  is_media_spoiler: tag.isMediaSpoiler
                }))
              )
              .onConflictDoUpdate({
                target: [animeTagEdge.anime_id, animeTagEdge.tag_id],
                set: {
                  rank: sql`excluded.rank`,
                  is_media_spoiler: sql`excluded.is_media_spoiler`
                }
              });
          })
        );
      }

      // External Links
      if (anilist.externalLinks?.length) {
        ops.push(
          tx
            .insert(animeExternalLink)
            .values(
              uniqueBy(anilist.externalLinks, (e) => e.id).map((link) => ({
                id: link.id,
                url: link.url,
                site: link.site,
                site_id: link.siteId,
                type: link.type,
                language: link.language,
                color: link.color,
                icon: link.icon,
                notes: link.notes,
                is_disabled: link.isDisabled,
                anime_id: anilist.id
              }))
            )
            .onConflictDoUpdate({
              target: animeExternalLink.id,
              set: {
                url: sql`excluded.url`,
                site: sql`excluded.site`,
                site_id: sql`excluded.site_id`,
                type: sql`excluded.type`,
                language: sql`excluded.language`,
                color: sql`excluded.color`,
                icon: sql`excluded.icon`,
                notes: sql`excluded.notes`,
                is_disabled: sql`excluded.is_disabled`,
                anime_id: sql`excluded.anime_id`
              }
            })
        );
      }

      // Score Distribution
      if (anilist.stats?.scoreDistribution?.length) {
        ops.push(
          tx
            .insert(animeScoreDistribution)
            .values(
              anilist.stats.scoreDistribution.map((dist) => ({
                anime_id: anilist.id,
                score: dist.score,
                amount: dist.amount
              }))
            )
            .onConflictDoUpdate({
              target: [animeScoreDistribution.anime_id, animeScoreDistribution.score],
              set: { amount: sql`excluded.amount` }
            })
        );
      }

      // Status Distribution
      if (anilist.stats?.statusDistribution?.length) {
        ops.push(
          tx
            .insert(animeStatusDistribution)
            .values(
              anilist.stats.statusDistribution.map((dist) => ({
                anime_id: anilist.id,
                status: dist.status,
                amount: dist.amount
              }))
            )
            .onConflictDoUpdate({
              target: [animeStatusDistribution.anime_id, animeStatusDistribution.status],
              set: { amount: sql`excluded.amount` }
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
