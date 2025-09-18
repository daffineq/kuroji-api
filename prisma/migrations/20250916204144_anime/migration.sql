/*
  Warnings:

  - The primary key for the `TvdbLogin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_CharacterVoiceActors` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `AiredOn` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Anilibria` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilibriaAgeRating` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilibriaEpisode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilibriaEpisodeEnding` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilibriaEpisodeOpening` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilibriaEpisodePreview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilibriaGenre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilibriaGenreEdge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilibriaName` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilibriaPoster` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilibriaPublishDay` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilibriaSeason` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilibriaSponsor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilibriaTorrent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilibriaTorrentCodec` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilibriaTorrentColor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilibriaTorrentQuality` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilibriaTorrentType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilibriaType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Anilist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilistAiringSchedule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilistCharacter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilistCharacterEdge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilistCharacterImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilistCharacterName` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilistCover` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilistExternalLink` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilistIndex` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilistLastEpisode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilistLatestEpisode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilistNextEpisode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilistRanking` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilistScoreDistribution` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilistStatusDistribution` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilistStreamingEpisode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilistStudio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilistStudioEdge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilistTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilistTagEdge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilistTitle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilistTrailer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilistVoiceImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnilistVoiceName` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnimeKai` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnimekaiEpisode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Animepahe` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnimepaheEpisode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnimepaheExternalLink` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EndDate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Kitsu` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `KitsuAnimeCharacters` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `KitsuAnimeProductions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `KitsuAnimeStaff` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `KitsuCastings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `KitsuCategories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `KitsuCoverImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `KitsuEpisodes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `KitsuGenres` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `KitsuInstallments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `KitsuMappings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `KitsuMediaRelationships` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `KitsuPosterImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `KitsuReviews` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `KitsuStreamingLinks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `KitsuTitle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReleaseIndex` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReleasedOn` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Shikimori` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShikimoriPoster` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShikimoriScreenshot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShikimoriVideo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StartDate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Title` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tmdb` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TmdbLastEpisodeToAir` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TmdbNextEpisodeToAir` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TmdbReleaseSeason` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TmdbSeason` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TmdbSeasonEpisode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TmdbSeasonEpisodeImages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TmdbSeasonStillImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tvdb` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TvdbLanguage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TvdbLanguageTranslation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TvdbStatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TvdbTrailer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VoiceActor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Zoro` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ZoroEpisode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ZoroSeason` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AnimekaiEpisode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AnimepaheEpisode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AnimepaheExLink` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ShikimoriScreenshot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ShikimoriVideo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TmdbReleaseSeason` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TvdbAliases` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TvdbArtworks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TvdbRemote` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TvdbTrailers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ZoroEpisode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ZoroSeason` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `anizip` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `anizip_episode_titles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `anizip_episodes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `anizip_images` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `anizip_mappings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `anizip_titles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tvdb_aliases` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tvdb_artworks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tvdb_remote` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[idAl]` on the table `Anime` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idMal]` on the table `Anime` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."AiredOn" DROP CONSTRAINT "AiredOn_shikimoriId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Anilibria" DROP CONSTRAINT "Anilibria_anilist_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnilibriaAgeRating" DROP CONSTRAINT "AnilibriaAgeRating_anilibriaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnilibriaEpisode" DROP CONSTRAINT "AnilibriaEpisode_anilibriaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnilibriaEpisodeEnding" DROP CONSTRAINT "AnilibriaEpisodeEnding_episodeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnilibriaEpisodeOpening" DROP CONSTRAINT "AnilibriaEpisodeOpening_episodeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnilibriaEpisodePreview" DROP CONSTRAINT "AnilibriaEpisodePreview_episodeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnilibriaGenreEdge" DROP CONSTRAINT "AnilibriaGenreEdge_anilibriaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnilibriaGenreEdge" DROP CONSTRAINT "AnilibriaGenreEdge_genreId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnilibriaName" DROP CONSTRAINT "AnilibriaName_anilibriaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnilibriaPoster" DROP CONSTRAINT "AnilibriaPoster_anilibriaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnilibriaPublishDay" DROP CONSTRAINT "AnilibriaPublishDay_anilibriaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnilibriaSeason" DROP CONSTRAINT "AnilibriaSeason_anilibriaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnilibriaSponsor" DROP CONSTRAINT "AnilibriaSponsor_anilibriaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnilibriaTorrent" DROP CONSTRAINT "AnilibriaTorrent_anilibriaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnilibriaTorrentCodec" DROP CONSTRAINT "AnilibriaTorrentCodec_torrentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnilibriaTorrentColor" DROP CONSTRAINT "AnilibriaTorrentColor_torrentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnilibriaTorrentQuality" DROP CONSTRAINT "AnilibriaTorrentQuality_torrentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnilibriaTorrentType" DROP CONSTRAINT "AnilibriaTorrentType_torrentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnilibriaType" DROP CONSTRAINT "AnilibriaType_anilibriaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnilistAiringSchedule" DROP CONSTRAINT "AnilistAiringSchedule_anilistId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnilistCharacterEdge" DROP CONSTRAINT "AnilistCharacterEdge_anilistId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnilistCharacterEdge" DROP CONSTRAINT "AnilistCharacterEdge_characterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnilistCharacterImage" DROP CONSTRAINT "AnilistCharacterImage_characterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnilistCharacterName" DROP CONSTRAINT "AnilistCharacterName_characterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnilistCover" DROP CONSTRAINT "AnilistCover_anilistId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnilistExternalLink" DROP CONSTRAINT "AnilistExternalLink_anilistId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnilistLastEpisode" DROP CONSTRAINT "AnilistLastEpisode_anilistId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnilistLatestEpisode" DROP CONSTRAINT "AnilistLatestEpisode_anilistId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnilistNextEpisode" DROP CONSTRAINT "AnilistNextEpisode_anilistId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnilistRanking" DROP CONSTRAINT "AnilistRanking_anilistId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnilistScoreDistribution" DROP CONSTRAINT "AnilistScoreDistribution_anilistId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnilistStatusDistribution" DROP CONSTRAINT "AnilistStatusDistribution_anilistId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnilistStreamingEpisode" DROP CONSTRAINT "AnilistStreamingEpisode_anilistId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnilistStudioEdge" DROP CONSTRAINT "AnilistStudioEdge_anilistId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnilistStudioEdge" DROP CONSTRAINT "AnilistStudioEdge_studioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnilistTagEdge" DROP CONSTRAINT "AnilistTagEdge_anilistId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnilistTagEdge" DROP CONSTRAINT "AnilistTagEdge_tagId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnilistTitle" DROP CONSTRAINT "AnilistTitle_anilistId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnilistTrailer" DROP CONSTRAINT "AnilistTrailer_anilistId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnilistVoiceImage" DROP CONSTRAINT "AnilistVoiceImage_voiceActorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnilistVoiceName" DROP CONSTRAINT "AnilistVoiceName_voiceActorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnimeKai" DROP CONSTRAINT "AnimeKai_anilistId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Animepahe" DROP CONSTRAINT "Animepahe_idAl_fkey";

-- DropForeignKey
ALTER TABLE "public"."EndDate" DROP CONSTRAINT "EndDate_anilistId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Kitsu" DROP CONSTRAINT "Kitsu_idAl_fkey";

-- DropForeignKey
ALTER TABLE "public"."KitsuAnimeCharacters" DROP CONSTRAINT "KitsuAnimeCharacters_kitsuId_fkey";

-- DropForeignKey
ALTER TABLE "public"."KitsuAnimeProductions" DROP CONSTRAINT "KitsuAnimeProductions_kitsuId_fkey";

-- DropForeignKey
ALTER TABLE "public"."KitsuAnimeStaff" DROP CONSTRAINT "KitsuAnimeStaff_kitsuId_fkey";

-- DropForeignKey
ALTER TABLE "public"."KitsuCastings" DROP CONSTRAINT "KitsuCastings_kitsuId_fkey";

-- DropForeignKey
ALTER TABLE "public"."KitsuCategories" DROP CONSTRAINT "KitsuCategories_kitsuId_fkey";

-- DropForeignKey
ALTER TABLE "public"."KitsuCoverImage" DROP CONSTRAINT "KitsuCoverImage_kitsuId_fkey";

-- DropForeignKey
ALTER TABLE "public"."KitsuEpisodes" DROP CONSTRAINT "KitsuEpisodes_kitsuId_fkey";

-- DropForeignKey
ALTER TABLE "public"."KitsuGenres" DROP CONSTRAINT "KitsuGenres_kitsuId_fkey";

-- DropForeignKey
ALTER TABLE "public"."KitsuInstallments" DROP CONSTRAINT "KitsuInstallments_kitsuId_fkey";

-- DropForeignKey
ALTER TABLE "public"."KitsuMappings" DROP CONSTRAINT "KitsuMappings_kitsuId_fkey";

-- DropForeignKey
ALTER TABLE "public"."KitsuMediaRelationships" DROP CONSTRAINT "KitsuMediaRelationships_kitsuId_fkey";

-- DropForeignKey
ALTER TABLE "public"."KitsuPosterImage" DROP CONSTRAINT "KitsuPosterImage_kitsuId_fkey";

-- DropForeignKey
ALTER TABLE "public"."KitsuReviews" DROP CONSTRAINT "KitsuReviews_kitsuId_fkey";

-- DropForeignKey
ALTER TABLE "public"."KitsuStreamingLinks" DROP CONSTRAINT "KitsuStreamingLinks_kitsuId_fkey";

-- DropForeignKey
ALTER TABLE "public"."KitsuTitle" DROP CONSTRAINT "KitsuTitle_kitsuId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ReleasedOn" DROP CONSTRAINT "ReleasedOn_shikimoriId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Shikimori" DROP CONSTRAINT "Shikimori_malId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ShikimoriPoster" DROP CONSTRAINT "ShikimoriPoster_shikimoriId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StartDate" DROP CONSTRAINT "StartDate_anilistId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TmdbLastEpisodeToAir" DROP CONSTRAINT "TmdbLastEpisodeToAir_show_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."TmdbNextEpisodeToAir" DROP CONSTRAINT "TmdbNextEpisodeToAir_show_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."TmdbSeason" DROP CONSTRAINT "TmdbSeason_show_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."TmdbSeasonEpisode" DROP CONSTRAINT "TmdbSeasonEpisode_season_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."TmdbSeasonEpisode" DROP CONSTRAINT "TmdbSeasonEpisode_show_fkey";

-- DropForeignKey
ALTER TABLE "public"."TmdbSeasonEpisodeImages" DROP CONSTRAINT "TmdbSeasonEpisodeImages_episodeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TmdbSeasonStillImage" DROP CONSTRAINT "TmdbSeasonStillImage_episodeImagesId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TvdbStatus" DROP CONSTRAINT "TvdbStatus_tvdbId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Zoro" DROP CONSTRAINT "Zoro_idAl_fkey";

-- DropForeignKey
ALTER TABLE "public"."_AnimekaiEpisode" DROP CONSTRAINT "_AnimekaiEpisode_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_AnimekaiEpisode" DROP CONSTRAINT "_AnimekaiEpisode_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_AnimepaheEpisode" DROP CONSTRAINT "_AnimepaheEpisode_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_AnimepaheEpisode" DROP CONSTRAINT "_AnimepaheEpisode_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_AnimepaheExLink" DROP CONSTRAINT "_AnimepaheExLink_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_AnimepaheExLink" DROP CONSTRAINT "_AnimepaheExLink_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_CharacterVoiceActors" DROP CONSTRAINT "_CharacterVoiceActors_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_CharacterVoiceActors" DROP CONSTRAINT "_CharacterVoiceActors_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ShikimoriScreenshot" DROP CONSTRAINT "_ShikimoriScreenshot_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ShikimoriScreenshot" DROP CONSTRAINT "_ShikimoriScreenshot_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ShikimoriVideo" DROP CONSTRAINT "_ShikimoriVideo_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ShikimoriVideo" DROP CONSTRAINT "_ShikimoriVideo_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_TmdbReleaseSeason" DROP CONSTRAINT "_TmdbReleaseSeason_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_TmdbReleaseSeason" DROP CONSTRAINT "_TmdbReleaseSeason_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_TvdbAliases" DROP CONSTRAINT "_TvdbAliases_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_TvdbAliases" DROP CONSTRAINT "_TvdbAliases_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_TvdbArtworks" DROP CONSTRAINT "_TvdbArtworks_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_TvdbArtworks" DROP CONSTRAINT "_TvdbArtworks_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_TvdbRemote" DROP CONSTRAINT "_TvdbRemote_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_TvdbRemote" DROP CONSTRAINT "_TvdbRemote_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_TvdbTrailers" DROP CONSTRAINT "_TvdbTrailers_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_TvdbTrailers" DROP CONSTRAINT "_TvdbTrailers_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ZoroEpisode" DROP CONSTRAINT "_ZoroEpisode_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ZoroEpisode" DROP CONSTRAINT "_ZoroEpisode_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ZoroSeason" DROP CONSTRAINT "_ZoroSeason_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ZoroSeason" DROP CONSTRAINT "_ZoroSeason_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."anizip_episode_titles" DROP CONSTRAINT "anizip_episode_titles_episode_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."anizip_episodes" DROP CONSTRAINT "anizip_episodes_anizip_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."anizip_images" DROP CONSTRAINT "anizip_images_anizip_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."anizip_mappings" DROP CONSTRAINT "anizip_mappings_anizip_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."anizip_titles" DROP CONSTRAINT "anizip_titles_anizip_id_fkey";

-- AlterTable
ALTER TABLE "public"."Anime" ADD COLUMN     "countryOfOrigin" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "episodes" INTEGER,
ADD COLUMN     "favorites" INTEGER,
ADD COLUMN     "format" TEXT,
ADD COLUMN     "hashtag" TEXT,
ADD COLUMN     "isAdult" BOOLEAN,
ADD COLUMN     "isLicensed" BOOLEAN,
ADD COLUMN     "popularity" INTEGER,
ADD COLUMN     "score" INTEGER,
ADD COLUMN     "season" TEXT,
ADD COLUMN     "seasonYear" INTEGER,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "status" TEXT,
ADD COLUMN     "trending" INTEGER,
ADD COLUMN     "type" TEXT;

-- AlterTable
ALTER TABLE "public"."TvdbLogin" DROP CONSTRAINT "TvdbLogin_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "TvdbLogin_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "TvdbLogin_id_seq";

-- AlterTable
ALTER TABLE "public"."_CharacterVoiceActors" DROP CONSTRAINT "_CharacterVoiceActors_AB_pkey",
ALTER COLUMN "A" SET DATA TYPE TEXT,
ALTER COLUMN "B" SET DATA TYPE TEXT,
ADD CONSTRAINT "_CharacterVoiceActors_AB_pkey" PRIMARY KEY ("A", "B");

-- DropTable
DROP TABLE "public"."AiredOn";

-- DropTable
DROP TABLE "public"."Anilibria";

-- DropTable
DROP TABLE "public"."AnilibriaAgeRating";

-- DropTable
DROP TABLE "public"."AnilibriaEpisode";

-- DropTable
DROP TABLE "public"."AnilibriaEpisodeEnding";

-- DropTable
DROP TABLE "public"."AnilibriaEpisodeOpening";

-- DropTable
DROP TABLE "public"."AnilibriaEpisodePreview";

-- DropTable
DROP TABLE "public"."AnilibriaGenre";

-- DropTable
DROP TABLE "public"."AnilibriaGenreEdge";

-- DropTable
DROP TABLE "public"."AnilibriaName";

-- DropTable
DROP TABLE "public"."AnilibriaPoster";

-- DropTable
DROP TABLE "public"."AnilibriaPublishDay";

-- DropTable
DROP TABLE "public"."AnilibriaSeason";

-- DropTable
DROP TABLE "public"."AnilibriaSponsor";

-- DropTable
DROP TABLE "public"."AnilibriaTorrent";

-- DropTable
DROP TABLE "public"."AnilibriaTorrentCodec";

-- DropTable
DROP TABLE "public"."AnilibriaTorrentColor";

-- DropTable
DROP TABLE "public"."AnilibriaTorrentQuality";

-- DropTable
DROP TABLE "public"."AnilibriaTorrentType";

-- DropTable
DROP TABLE "public"."AnilibriaType";

-- DropTable
DROP TABLE "public"."Anilist";

-- DropTable
DROP TABLE "public"."AnilistAiringSchedule";

-- DropTable
DROP TABLE "public"."AnilistCharacter";

-- DropTable
DROP TABLE "public"."AnilistCharacterEdge";

-- DropTable
DROP TABLE "public"."AnilistCharacterImage";

-- DropTable
DROP TABLE "public"."AnilistCharacterName";

-- DropTable
DROP TABLE "public"."AnilistCover";

-- DropTable
DROP TABLE "public"."AnilistExternalLink";

-- DropTable
DROP TABLE "public"."AnilistIndex";

-- DropTable
DROP TABLE "public"."AnilistLastEpisode";

-- DropTable
DROP TABLE "public"."AnilistLatestEpisode";

-- DropTable
DROP TABLE "public"."AnilistNextEpisode";

-- DropTable
DROP TABLE "public"."AnilistRanking";

-- DropTable
DROP TABLE "public"."AnilistScoreDistribution";

-- DropTable
DROP TABLE "public"."AnilistStatusDistribution";

-- DropTable
DROP TABLE "public"."AnilistStreamingEpisode";

-- DropTable
DROP TABLE "public"."AnilistStudio";

-- DropTable
DROP TABLE "public"."AnilistStudioEdge";

-- DropTable
DROP TABLE "public"."AnilistTag";

-- DropTable
DROP TABLE "public"."AnilistTagEdge";

-- DropTable
DROP TABLE "public"."AnilistTitle";

-- DropTable
DROP TABLE "public"."AnilistTrailer";

-- DropTable
DROP TABLE "public"."AnilistVoiceImage";

-- DropTable
DROP TABLE "public"."AnilistVoiceName";

-- DropTable
DROP TABLE "public"."AnimeKai";

-- DropTable
DROP TABLE "public"."AnimekaiEpisode";

-- DropTable
DROP TABLE "public"."Animepahe";

-- DropTable
DROP TABLE "public"."AnimepaheEpisode";

-- DropTable
DROP TABLE "public"."AnimepaheExternalLink";

-- DropTable
DROP TABLE "public"."EndDate";

-- DropTable
DROP TABLE "public"."Kitsu";

-- DropTable
DROP TABLE "public"."KitsuAnimeCharacters";

-- DropTable
DROP TABLE "public"."KitsuAnimeProductions";

-- DropTable
DROP TABLE "public"."KitsuAnimeStaff";

-- DropTable
DROP TABLE "public"."KitsuCastings";

-- DropTable
DROP TABLE "public"."KitsuCategories";

-- DropTable
DROP TABLE "public"."KitsuCoverImage";

-- DropTable
DROP TABLE "public"."KitsuEpisodes";

-- DropTable
DROP TABLE "public"."KitsuGenres";

-- DropTable
DROP TABLE "public"."KitsuInstallments";

-- DropTable
DROP TABLE "public"."KitsuMappings";

-- DropTable
DROP TABLE "public"."KitsuMediaRelationships";

-- DropTable
DROP TABLE "public"."KitsuPosterImage";

-- DropTable
DROP TABLE "public"."KitsuReviews";

-- DropTable
DROP TABLE "public"."KitsuStreamingLinks";

-- DropTable
DROP TABLE "public"."KitsuTitle";

-- DropTable
DROP TABLE "public"."ReleaseIndex";

-- DropTable
DROP TABLE "public"."ReleasedOn";

-- DropTable
DROP TABLE "public"."Shikimori";

-- DropTable
DROP TABLE "public"."ShikimoriPoster";

-- DropTable
DROP TABLE "public"."ShikimoriScreenshot";

-- DropTable
DROP TABLE "public"."ShikimoriVideo";

-- DropTable
DROP TABLE "public"."StartDate";

-- DropTable
DROP TABLE "public"."Title";

-- DropTable
DROP TABLE "public"."Tmdb";

-- DropTable
DROP TABLE "public"."TmdbLastEpisodeToAir";

-- DropTable
DROP TABLE "public"."TmdbNextEpisodeToAir";

-- DropTable
DROP TABLE "public"."TmdbReleaseSeason";

-- DropTable
DROP TABLE "public"."TmdbSeason";

-- DropTable
DROP TABLE "public"."TmdbSeasonEpisode";

-- DropTable
DROP TABLE "public"."TmdbSeasonEpisodeImages";

-- DropTable
DROP TABLE "public"."TmdbSeasonStillImage";

-- DropTable
DROP TABLE "public"."Tvdb";

-- DropTable
DROP TABLE "public"."TvdbLanguage";

-- DropTable
DROP TABLE "public"."TvdbLanguageTranslation";

-- DropTable
DROP TABLE "public"."TvdbStatus";

-- DropTable
DROP TABLE "public"."TvdbTrailer";

-- DropTable
DROP TABLE "public"."VoiceActor";

-- DropTable
DROP TABLE "public"."Zoro";

-- DropTable
DROP TABLE "public"."ZoroEpisode";

-- DropTable
DROP TABLE "public"."ZoroSeason";

-- DropTable
DROP TABLE "public"."_AnimekaiEpisode";

-- DropTable
DROP TABLE "public"."_AnimepaheEpisode";

-- DropTable
DROP TABLE "public"."_AnimepaheExLink";

-- DropTable
DROP TABLE "public"."_ShikimoriScreenshot";

-- DropTable
DROP TABLE "public"."_ShikimoriVideo";

-- DropTable
DROP TABLE "public"."_TmdbReleaseSeason";

-- DropTable
DROP TABLE "public"."_TvdbAliases";

-- DropTable
DROP TABLE "public"."_TvdbArtworks";

-- DropTable
DROP TABLE "public"."_TvdbRemote";

-- DropTable
DROP TABLE "public"."_TvdbTrailers";

-- DropTable
DROP TABLE "public"."_ZoroEpisode";

-- DropTable
DROP TABLE "public"."_ZoroSeason";

-- DropTable
DROP TABLE "public"."anizip";

-- DropTable
DROP TABLE "public"."anizip_episode_titles";

-- DropTable
DROP TABLE "public"."anizip_episodes";

-- DropTable
DROP TABLE "public"."anizip_images";

-- DropTable
DROP TABLE "public"."anizip_mappings";

-- DropTable
DROP TABLE "public"."anizip_titles";

-- DropTable
DROP TABLE "public"."tvdb_aliases";

-- DropTable
DROP TABLE "public"."tvdb_artworks";

-- DropTable
DROP TABLE "public"."tvdb_remote";

-- CreateTable
CREATE TABLE "public"."AnimePoster" (
    "id" TEXT NOT NULL,
    "animeId" TEXT NOT NULL,
    "color" TEXT,
    "large" TEXT,
    "medium" TEXT,
    "extraLarge" TEXT,

    CONSTRAINT "AnimePoster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnimeOtherPoster" (
    "id" TEXT NOT NULL,
    "animeId" TEXT NOT NULL,
    "small" TEXT,
    "medium" TEXT,
    "large" TEXT,

    CONSTRAINT "AnimeOtherPoster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnimeBanner" (
    "id" TEXT NOT NULL,
    "animeId" TEXT NOT NULL,
    "small" TEXT,
    "medium" TEXT,
    "large" TEXT,

    CONSTRAINT "AnimeBanner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnimeOtherBanner" (
    "id" TEXT NOT NULL,
    "animeId" TEXT NOT NULL,
    "small" TEXT,
    "medium" TEXT,
    "large" TEXT,

    CONSTRAINT "AnimeOtherBanner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnimeTitle" (
    "id" TEXT NOT NULL,
    "animeId" TEXT NOT NULL,
    "romaji" TEXT,
    "english" TEXT,
    "native" TEXT,

    CONSTRAINT "AnimeTitle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnimeOtherTitle" (
    "id" TEXT NOT NULL,
    "animeId" TEXT NOT NULL,
    "synonym" TEXT,
    "source" TEXT,
    "type" TEXT,

    CONSTRAINT "AnimeOtherTitle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnimeOtherDescription" (
    "id" TEXT NOT NULL,
    "animeId" TEXT NOT NULL,
    "description" TEXT,
    "source" TEXT,
    "type" TEXT,

    CONSTRAINT "AnimeOtherDescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnimeStartDate" (
    "id" TEXT NOT NULL,
    "animeId" TEXT NOT NULL,
    "day" INTEGER,
    "month" INTEGER,
    "year" INTEGER,

    CONSTRAINT "AnimeStartDate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnimeEndDate" (
    "id" TEXT NOT NULL,
    "animeId" TEXT NOT NULL,
    "day" INTEGER,
    "month" INTEGER,
    "year" INTEGER,

    CONSTRAINT "AnimeEndDate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnimeGenre" (
    "id" TEXT NOT NULL,
    "animeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AnimeGenre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnimeAiringSchedule" (
    "id" TEXT NOT NULL,
    "idAl" INTEGER NOT NULL,
    "animeId" TEXT NOT NULL,
    "episode" INTEGER,
    "airingAt" INTEGER,

    CONSTRAINT "AnimeAiringSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnimeLatestEpisode" (
    "id" TEXT NOT NULL,
    "idAl" INTEGER NOT NULL,
    "animeId" TEXT NOT NULL,
    "episode" INTEGER,
    "airingAt" INTEGER,

    CONSTRAINT "AnimeLatestEpisode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnimeNextEpisode" (
    "id" TEXT NOT NULL,
    "idAl" INTEGER NOT NULL,
    "animeId" TEXT NOT NULL,
    "episode" INTEGER,
    "airingAt" INTEGER,

    CONSTRAINT "AnimeNextEpisode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnimeLastEpisode" (
    "id" TEXT NOT NULL,
    "idAl" INTEGER NOT NULL,
    "animeId" TEXT NOT NULL,
    "episode" INTEGER,
    "airingAt" INTEGER,

    CONSTRAINT "AnimeLastEpisode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnimeCharacterEdge" (
    "id" TEXT NOT NULL,
    "alId" INTEGER NOT NULL,
    "animeId" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "role" TEXT,

    CONSTRAINT "AnimeCharacterEdge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnimeCharacter" (
    "id" TEXT NOT NULL,
    "idAl" INTEGER NOT NULL,

    CONSTRAINT "AnimeCharacter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnimeVoiceActor" (
    "id" TEXT NOT NULL,
    "idAl" INTEGER NOT NULL,
    "language" TEXT,

    CONSTRAINT "AnimeVoiceActor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnimeCharacterName" (
    "id" TEXT NOT NULL,
    "full" TEXT,
    "native" TEXT,
    "alternative" TEXT[],
    "characterId" TEXT,

    CONSTRAINT "AnimeCharacterName_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnimeCharacterImage" (
    "id" TEXT NOT NULL,
    "large" TEXT,
    "medium" TEXT,
    "characterId" TEXT,

    CONSTRAINT "AnimeCharacterImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnimeVoiceName" (
    "id" TEXT NOT NULL,
    "full" TEXT,
    "native" TEXT,
    "alternative" TEXT[],
    "voiceActorId" TEXT,

    CONSTRAINT "AnimeVoiceName_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnimeVoiceImage" (
    "id" TEXT NOT NULL,
    "large" TEXT,
    "medium" TEXT,
    "voiceActorId" TEXT,

    CONSTRAINT "AnimeVoiceImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnimeStudioEdge" (
    "id" TEXT NOT NULL,
    "idAl" INTEGER NOT NULL,
    "animeId" TEXT NOT NULL,
    "studioId" TEXT NOT NULL,
    "isMain" BOOLEAN,

    CONSTRAINT "AnimeStudioEdge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnimeStudio" (
    "id" TEXT NOT NULL,
    "idAl" INTEGER NOT NULL,
    "name" TEXT,

    CONSTRAINT "AnimeStudio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnimeTagEdge" (
    "id" TEXT NOT NULL,
    "animeId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "rank" INTEGER,
    "isMediaSpoiler" BOOLEAN,

    CONSTRAINT "AnimeTagEdge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnimeTag" (
    "id" TEXT NOT NULL,
    "idAl" INTEGER NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "category" TEXT,
    "isGeneralSpoiler" BOOLEAN,
    "isAdult" BOOLEAN,

    CONSTRAINT "AnimeTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnimeRanking" (
    "id" TEXT NOT NULL,
    "idAl" INTEGER NOT NULL,
    "animeId" TEXT NOT NULL,
    "rank" INTEGER,
    "type" TEXT,
    "format" TEXT,
    "year" INTEGER,
    "season" TEXT,
    "allTime" BOOLEAN,
    "context" TEXT NOT NULL,

    CONSTRAINT "AnimeRanking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnimeExternalLink" (
    "id" TEXT NOT NULL,
    "idAl" INTEGER NOT NULL,
    "animeId" TEXT NOT NULL,
    "url" TEXT,
    "site" TEXT,
    "siteId" INTEGER,
    "type" TEXT,
    "language" TEXT,
    "color" TEXT,
    "icon" TEXT,
    "notes" TEXT,
    "isDisabled" BOOLEAN,

    CONSTRAINT "AnimeExternalLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnimeScoreDistribution" (
    "id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "animeId" TEXT NOT NULL,

    CONSTRAINT "AnimeScoreDistribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnimeStatusDistribution" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "animeId" TEXT NOT NULL,

    CONSTRAINT "AnimeStatusDistribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnimeVideo" (
    "id" TEXT NOT NULL,
    "url" TEXT,
    "name" TEXT,
    "kind" TEXT,
    "playerUrl" TEXT,
    "imageUrl" TEXT,

    CONSTRAINT "AnimeVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnimeScreenshot" (
    "id" TEXT NOT NULL,
    "originalUrl" TEXT,
    "x166Url" TEXT,
    "x332Url" TEXT,

    CONSTRAINT "AnimeScreenshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnimeArtwork" (
    "id" TEXT NOT NULL,
    "idTvdb" INTEGER NOT NULL,
    "height" INTEGER,
    "image" TEXT,
    "includesText" BOOLEAN,
    "language" TEXT,
    "score" INTEGER,
    "thumbnail" TEXT,
    "type" INTEGER,
    "width" INTEGER,

    CONSTRAINT "AnimeArtwork_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_AnimeVideos" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AnimeVideos_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_AnimeScreenshots" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AnimeScreenshots_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_AnimeArtworks" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AnimeArtworks_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "AnimePoster_animeId_key" ON "public"."AnimePoster"("animeId");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeBanner_animeId_key" ON "public"."AnimeBanner"("animeId");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeTitle_animeId_key" ON "public"."AnimeTitle"("animeId");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeStartDate_animeId_key" ON "public"."AnimeStartDate"("animeId");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeEndDate_animeId_key" ON "public"."AnimeEndDate"("animeId");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeGenre_animeId_key" ON "public"."AnimeGenre"("animeId");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeGenre_name_key" ON "public"."AnimeGenre"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeAiringSchedule_idAl_key" ON "public"."AnimeAiringSchedule"("idAl");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeLatestEpisode_idAl_key" ON "public"."AnimeLatestEpisode"("idAl");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeLatestEpisode_animeId_key" ON "public"."AnimeLatestEpisode"("animeId");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeNextEpisode_idAl_key" ON "public"."AnimeNextEpisode"("idAl");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeNextEpisode_animeId_key" ON "public"."AnimeNextEpisode"("animeId");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeLastEpisode_idAl_key" ON "public"."AnimeLastEpisode"("idAl");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeLastEpisode_animeId_key" ON "public"."AnimeLastEpisode"("animeId");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeCharacterEdge_alId_key" ON "public"."AnimeCharacterEdge"("alId");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeCharacter_idAl_key" ON "public"."AnimeCharacter"("idAl");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeVoiceActor_idAl_key" ON "public"."AnimeVoiceActor"("idAl");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeCharacterName_characterId_key" ON "public"."AnimeCharacterName"("characterId");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeCharacterImage_characterId_key" ON "public"."AnimeCharacterImage"("characterId");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeVoiceName_voiceActorId_key" ON "public"."AnimeVoiceName"("voiceActorId");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeVoiceImage_voiceActorId_key" ON "public"."AnimeVoiceImage"("voiceActorId");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeStudioEdge_idAl_key" ON "public"."AnimeStudioEdge"("idAl");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeStudio_idAl_key" ON "public"."AnimeStudio"("idAl");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeTagEdge_animeId_tagId_key" ON "public"."AnimeTagEdge"("animeId", "tagId");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeTag_idAl_key" ON "public"."AnimeTag"("idAl");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeTag_name_key" ON "public"."AnimeTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeRanking_idAl_key" ON "public"."AnimeRanking"("idAl");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeExternalLink_idAl_key" ON "public"."AnimeExternalLink"("idAl");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeArtwork_idTvdb_key" ON "public"."AnimeArtwork"("idTvdb");

-- CreateIndex
CREATE INDEX "_AnimeVideos_B_index" ON "public"."_AnimeVideos"("B");

-- CreateIndex
CREATE INDEX "_AnimeScreenshots_B_index" ON "public"."_AnimeScreenshots"("B");

-- CreateIndex
CREATE INDEX "_AnimeArtworks_B_index" ON "public"."_AnimeArtworks"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Anime_idAl_key" ON "public"."Anime"("idAl");

-- CreateIndex
CREATE UNIQUE INDEX "Anime_idMal_key" ON "public"."Anime"("idMal");

-- AddForeignKey
ALTER TABLE "public"."AnimePoster" ADD CONSTRAINT "anime_poster_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeOtherPoster" ADD CONSTRAINT "AnimeOtherPoster_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeBanner" ADD CONSTRAINT "anime_banner_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeOtherBanner" ADD CONSTRAINT "AnimeOtherBanner_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeTitle" ADD CONSTRAINT "anime_title_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeOtherTitle" ADD CONSTRAINT "AnimeOtherTitle_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeOtherDescription" ADD CONSTRAINT "AnimeOtherDescription_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeStartDate" ADD CONSTRAINT "anime_start_date_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeEndDate" ADD CONSTRAINT "anime_end_date_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeGenre" ADD CONSTRAINT "AnimeGenre_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeAiringSchedule" ADD CONSTRAINT "AnimeAiringSchedule_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeLatestEpisode" ADD CONSTRAINT "AnimeLatestEpisode_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeNextEpisode" ADD CONSTRAINT "AnimeNextEpisode_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeLastEpisode" ADD CONSTRAINT "AnimeLastEpisode_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeCharacterEdge" ADD CONSTRAINT "AnimeCharacterEdge_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeCharacterEdge" ADD CONSTRAINT "AnimeCharacterEdge_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "public"."AnimeCharacter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeCharacterName" ADD CONSTRAINT "AnimeCharacterName_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "public"."AnimeCharacter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeCharacterImage" ADD CONSTRAINT "AnimeCharacterImage_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "public"."AnimeCharacter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeVoiceName" ADD CONSTRAINT "AnimeVoiceName_voiceActorId_fkey" FOREIGN KEY ("voiceActorId") REFERENCES "public"."AnimeVoiceActor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeVoiceImage" ADD CONSTRAINT "AnimeVoiceImage_voiceActorId_fkey" FOREIGN KEY ("voiceActorId") REFERENCES "public"."AnimeVoiceActor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeStudioEdge" ADD CONSTRAINT "AnimeStudioEdge_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeStudioEdge" ADD CONSTRAINT "AnimeStudioEdge_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "public"."AnimeStudio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeTagEdge" ADD CONSTRAINT "AnimeTagEdge_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeTagEdge" ADD CONSTRAINT "AnimeTagEdge_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "public"."AnimeTag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeRanking" ADD CONSTRAINT "AnimeRanking_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeExternalLink" ADD CONSTRAINT "AnimeExternalLink_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeScoreDistribution" ADD CONSTRAINT "AnimeScoreDistribution_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimeStatusDistribution" ADD CONSTRAINT "AnimeStatusDistribution_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AnimeVideos" ADD CONSTRAINT "_AnimeVideos_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Anime"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AnimeVideos" ADD CONSTRAINT "_AnimeVideos_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."AnimeVideo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AnimeScreenshots" ADD CONSTRAINT "_AnimeScreenshots_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Anime"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AnimeScreenshots" ADD CONSTRAINT "_AnimeScreenshots_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."AnimeScreenshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AnimeArtworks" ADD CONSTRAINT "_AnimeArtworks_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Anime"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AnimeArtworks" ADD CONSTRAINT "_AnimeArtworks_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."AnimeArtwork"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CharacterVoiceActors" ADD CONSTRAINT "_CharacterVoiceActors_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."AnimeCharacterEdge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CharacterVoiceActors" ADD CONSTRAINT "_CharacterVoiceActors_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."AnimeVoiceActor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
