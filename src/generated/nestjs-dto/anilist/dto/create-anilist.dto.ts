
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectAnilistTitleDto} from '../../anilistTitle/dto/connect-anilistTitle.dto.js'
import {ConnectAnilistCoverDto} from '../../anilistCover/dto/connect-anilistCover.dto.js'
import {ConnectStartDateDto} from '../../startDate/dto/connect-startDate.dto.js'
import {ConnectEndDateDto} from '../../endDate/dto/connect-endDate.dto.js'
import {ConnectAnilistTrailerDto} from '../../anilistTrailer/dto/connect-anilistTrailer.dto.js'
import {ConnectAnilistLatestEpisodeDto} from '../../anilistLatestEpisode/dto/connect-anilistLatestEpisode.dto.js'
import {ConnectAnilistNextEpisodeDto} from '../../anilistNextEpisode/dto/connect-anilistNextEpisode.dto.js'
import {ConnectAnilistLastEpisodeDto} from '../../anilistLastEpisode/dto/connect-anilistLastEpisode.dto.js'
import {CreateBasicIdAniDto} from '../../basicIdAni/dto/create-basicIdAni.dto.js'
import {ConnectBasicIdAniDto} from '../../basicIdAni/dto/connect-basicIdAni.dto.js'
import {CreateAnilistCharacterEdgeDto} from '../../anilistCharacterEdge/dto/create-anilistCharacterEdge.dto.js'
import {ConnectAnilistCharacterEdgeDto} from '../../anilistCharacterEdge/dto/connect-anilistCharacterEdge.dto.js'
import {CreateAnilistStudioEdgeDto} from '../../anilistStudioEdge/dto/create-anilistStudioEdge.dto.js'
import {ConnectAnilistStudioEdgeDto} from '../../anilistStudioEdge/dto/connect-anilistStudioEdge.dto.js'
import {CreateAnilistAiringScheduleDto} from '../../anilistAiringSchedule/dto/create-anilistAiringSchedule.dto.js'
import {ConnectAnilistAiringScheduleDto} from '../../anilistAiringSchedule/dto/connect-anilistAiringSchedule.dto.js'
import {CreateAnilistTagEdgeDto} from '../../anilistTagEdge/dto/create-anilistTagEdge.dto.js'
import {ConnectAnilistTagEdgeDto} from '../../anilistTagEdge/dto/connect-anilistTagEdge.dto.js'
import {CreateAnilistRankingDto} from '../../anilistRanking/dto/create-anilistRanking.dto.js'
import {ConnectAnilistRankingDto} from '../../anilistRanking/dto/connect-anilistRanking.dto.js'
import {CreateAnilistExternalLinkDto} from '../../anilistExternalLink/dto/create-anilistExternalLink.dto.js'
import {ConnectAnilistExternalLinkDto} from '../../anilistExternalLink/dto/connect-anilistExternalLink.dto.js'
import {CreateAnilistStreamingEpisodeDto} from '../../anilistStreamingEpisode/dto/create-anilistStreamingEpisode.dto.js'
import {ConnectAnilistStreamingEpisodeDto} from '../../anilistStreamingEpisode/dto/connect-anilistStreamingEpisode.dto.js'
import {CreateAnilistScoreDistributionDto} from '../../anilistScoreDistribution/dto/create-anilistScoreDistribution.dto.js'
import {ConnectAnilistScoreDistributionDto} from '../../anilistScoreDistribution/dto/connect-anilistScoreDistribution.dto.js'
import {CreateAnilistStatusDistributionDto} from '../../anilistStatusDistribution/dto/create-anilistStatusDistribution.dto.js'
import {ConnectAnilistStatusDistributionDto} from '../../anilistStatusDistribution/dto/connect-anilistStatusDistribution.dto.js'
import {ConnectAnilibriaDto} from '../../anilibria/dto/connect-anilibria.dto.js'
import {ConnectAnimepaheDto} from '../../animepahe/dto/connect-animepahe.dto.js'
import {ConnectAnimeKaiDto} from '../../animeKai/dto/connect-animeKai.dto.js'
import {ConnectZoroDto} from '../../zoro/dto/connect-zoro.dto.js'
import {ConnectShikimoriDto} from '../../shikimori/dto/connect-shikimori.dto.js'
import {ConnectKitsuDto} from '../../kitsu/dto/connect-kitsu.dto.js'
import {ConnectAniZipDto} from '../../aniZip/dto/connect-aniZip.dto.js'

export class CreateAnilistTitleRelationInputDto {
    @ApiProperty({
  type: ConnectAnilistTitleDto,
})
connect: ConnectAnilistTitleDto ;
  }
export class CreateAnilistCoverImageRelationInputDto {
    @ApiProperty({
  type: ConnectAnilistCoverDto,
})
connect: ConnectAnilistCoverDto ;
  }
export class CreateAnilistStartDateRelationInputDto {
    @ApiProperty({
  type: ConnectStartDateDto,
})
connect: ConnectStartDateDto ;
  }
export class CreateAnilistEndDateRelationInputDto {
    @ApiProperty({
  type: ConnectEndDateDto,
})
connect: ConnectEndDateDto ;
  }
export class CreateAnilistTrailerRelationInputDto {
    @ApiProperty({
  type: ConnectAnilistTrailerDto,
})
connect: ConnectAnilistTrailerDto ;
  }
export class CreateAnilistLatestAiringEpisodeRelationInputDto {
    @ApiProperty({
  type: ConnectAnilistLatestEpisodeDto,
})
connect: ConnectAnilistLatestEpisodeDto ;
  }
export class CreateAnilistNextAiringEpisodeRelationInputDto {
    @ApiProperty({
  type: ConnectAnilistNextEpisodeDto,
})
connect: ConnectAnilistNextEpisodeDto ;
  }
export class CreateAnilistLastAiringEpisodeRelationInputDto {
    @ApiProperty({
  type: ConnectAnilistLastEpisodeDto,
})
connect: ConnectAnilistLastEpisodeDto ;
  }
export class CreateAnilistRecommendationsRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateBasicIdAniDto,
  isArray: true,
})
create?: CreateBasicIdAniDto[] ;
@ApiProperty({
  required: false,
  type: ConnectBasicIdAniDto,
  isArray: true,
})
connect?: ConnectBasicIdAniDto[] ;
  }
export class CreateAnilistCharactersRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateAnilistCharacterEdgeDto,
  isArray: true,
})
create?: CreateAnilistCharacterEdgeDto[] ;
@ApiProperty({
  required: false,
  type: ConnectAnilistCharacterEdgeDto,
  isArray: true,
})
connect?: ConnectAnilistCharacterEdgeDto[] ;
  }
export class CreateAnilistStudiosRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateAnilistStudioEdgeDto,
  isArray: true,
})
create?: CreateAnilistStudioEdgeDto[] ;
@ApiProperty({
  required: false,
  type: ConnectAnilistStudioEdgeDto,
  isArray: true,
})
connect?: ConnectAnilistStudioEdgeDto[] ;
  }
export class CreateAnilistAiringScheduleRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateAnilistAiringScheduleDto,
  isArray: true,
})
create?: CreateAnilistAiringScheduleDto[] ;
@ApiProperty({
  required: false,
  type: ConnectAnilistAiringScheduleDto,
  isArray: true,
})
connect?: ConnectAnilistAiringScheduleDto[] ;
  }
export class CreateAnilistTagsRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateAnilistTagEdgeDto,
  isArray: true,
})
create?: CreateAnilistTagEdgeDto[] ;
@ApiProperty({
  required: false,
  type: ConnectAnilistTagEdgeDto,
  isArray: true,
})
connect?: ConnectAnilistTagEdgeDto[] ;
  }
export class CreateAnilistRankingsRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateAnilistRankingDto,
  isArray: true,
})
create?: CreateAnilistRankingDto[] ;
@ApiProperty({
  required: false,
  type: ConnectAnilistRankingDto,
  isArray: true,
})
connect?: ConnectAnilistRankingDto[] ;
  }
export class CreateAnilistExternalLinksRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateAnilistExternalLinkDto,
  isArray: true,
})
create?: CreateAnilistExternalLinkDto[] ;
@ApiProperty({
  required: false,
  type: ConnectAnilistExternalLinkDto,
  isArray: true,
})
connect?: ConnectAnilistExternalLinkDto[] ;
  }
export class CreateAnilistStreamingEpisodesRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateAnilistStreamingEpisodeDto,
  isArray: true,
})
create?: CreateAnilistStreamingEpisodeDto[] ;
@ApiProperty({
  required: false,
  type: ConnectAnilistStreamingEpisodeDto,
  isArray: true,
})
connect?: ConnectAnilistStreamingEpisodeDto[] ;
  }
export class CreateAnilistScoreDistributionRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateAnilistScoreDistributionDto,
  isArray: true,
})
create?: CreateAnilistScoreDistributionDto[] ;
@ApiProperty({
  required: false,
  type: ConnectAnilistScoreDistributionDto,
  isArray: true,
})
connect?: ConnectAnilistScoreDistributionDto[] ;
  }
export class CreateAnilistStatusDistributionRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateAnilistStatusDistributionDto,
  isArray: true,
})
create?: CreateAnilistStatusDistributionDto[] ;
@ApiProperty({
  required: false,
  type: ConnectAnilistStatusDistributionDto,
  isArray: true,
})
connect?: ConnectAnilistStatusDistributionDto[] ;
  }
export class CreateAnilistAnilibriaRelationInputDto {
    @ApiProperty({
  type: ConnectAnilibriaDto,
})
connect: ConnectAnilibriaDto ;
  }
export class CreateAnilistAnimepaheRelationInputDto {
    @ApiProperty({
  type: ConnectAnimepaheDto,
})
connect: ConnectAnimepaheDto ;
  }
export class CreateAnilistAnimekaiRelationInputDto {
    @ApiProperty({
  type: ConnectAnimeKaiDto,
})
connect: ConnectAnimeKaiDto ;
  }
export class CreateAnilistZoroRelationInputDto {
    @ApiProperty({
  type: ConnectZoroDto,
})
connect: ConnectZoroDto ;
  }
export class CreateAnilistShikimoriRelationInputDto {
    @ApiProperty({
  type: ConnectShikimoriDto,
})
connect: ConnectShikimoriDto ;
  }
export class CreateAnilistKitsuRelationInputDto {
    @ApiProperty({
  type: ConnectKitsuDto,
})
connect: ConnectKitsuDto ;
  }
export class CreateAnilistAnizipRelationInputDto {
    @ApiProperty({
  type: ConnectAniZipDto,
})
connect: ConnectAniZipDto ;
  }

@ApiExtraModels(ConnectAnilistTitleDto,CreateAnilistTitleRelationInputDto,ConnectAnilistCoverDto,CreateAnilistCoverImageRelationInputDto,ConnectStartDateDto,CreateAnilistStartDateRelationInputDto,ConnectEndDateDto,CreateAnilistEndDateRelationInputDto,ConnectAnilistTrailerDto,CreateAnilistTrailerRelationInputDto,ConnectAnilistLatestEpisodeDto,CreateAnilistLatestAiringEpisodeRelationInputDto,ConnectAnilistNextEpisodeDto,CreateAnilistNextAiringEpisodeRelationInputDto,ConnectAnilistLastEpisodeDto,CreateAnilistLastAiringEpisodeRelationInputDto,CreateBasicIdAniDto,ConnectBasicIdAniDto,CreateAnilistRecommendationsRelationInputDto,CreateAnilistCharacterEdgeDto,ConnectAnilistCharacterEdgeDto,CreateAnilistCharactersRelationInputDto,CreateAnilistStudioEdgeDto,ConnectAnilistStudioEdgeDto,CreateAnilistStudiosRelationInputDto,CreateAnilistAiringScheduleDto,ConnectAnilistAiringScheduleDto,CreateAnilistAiringScheduleRelationInputDto,CreateAnilistTagEdgeDto,ConnectAnilistTagEdgeDto,CreateAnilistTagsRelationInputDto,CreateAnilistRankingDto,ConnectAnilistRankingDto,CreateAnilistRankingsRelationInputDto,CreateAnilistExternalLinkDto,ConnectAnilistExternalLinkDto,CreateAnilistExternalLinksRelationInputDto,CreateAnilistStreamingEpisodeDto,ConnectAnilistStreamingEpisodeDto,CreateAnilistStreamingEpisodesRelationInputDto,CreateAnilistScoreDistributionDto,ConnectAnilistScoreDistributionDto,CreateAnilistScoreDistributionRelationInputDto,CreateAnilistStatusDistributionDto,ConnectAnilistStatusDistributionDto,CreateAnilistStatusDistributionRelationInputDto,ConnectAnilibriaDto,CreateAnilistAnilibriaRelationInputDto,ConnectAnimepaheDto,CreateAnilistAnimepaheRelationInputDto,ConnectAnimeKaiDto,CreateAnilistAnimekaiRelationInputDto,ConnectZoroDto,CreateAnilistZoroRelationInputDto,ConnectShikimoriDto,CreateAnilistShikimoriRelationInputDto,ConnectKitsuDto,CreateAnilistKitsuRelationInputDto,ConnectAniZipDto,CreateAnilistAnizipRelationInputDto)
export class CreateAnilistDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
idMal?: number  | null;
@ApiProperty({
  required: false,
  type: CreateAnilistTitleRelationInputDto,
})
title?: CreateAnilistTitleRelationInputDto ;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
bannerImage?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
status?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
type?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
format?: string  | null;
@ApiProperty({
  required: false,
  type: CreateAnilistCoverImageRelationInputDto,
})
coverImage?: CreateAnilistCoverImageRelationInputDto ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
updatedAt?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
description?: string  | null;
@ApiProperty({
  required: false,
  type: CreateAnilistStartDateRelationInputDto,
})
startDate?: CreateAnilistStartDateRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAnilistEndDateRelationInputDto,
})
endDate?: CreateAnilistEndDateRelationInputDto ;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
season?: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
seasonYear?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
episodes?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
duration?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
countryOfOrigin?: string  | null;
@ApiProperty({
  type: 'boolean',
  required: false,
  nullable: true,
})
isLicensed?: boolean  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
source?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
hashtag?: string  | null;
@ApiProperty({
  type: 'boolean',
  required: false,
  nullable: true,
})
isLocked?: boolean  | null;
@ApiProperty({
  type: 'boolean',
  required: false,
  nullable: true,
})
isAdult?: boolean  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
averageScore?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
meanScore?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
score?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
popularity?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
trending?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
favourites?: number  | null;
@ApiProperty({
  type: 'string',
  isArray: true,
})
genres: string[] ;
@ApiProperty({
  type: 'string',
  isArray: true,
})
synonyms: string[] ;
@ApiProperty({
  required: false,
  type: CreateAnilistTrailerRelationInputDto,
})
trailer?: CreateAnilistTrailerRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAnilistLatestAiringEpisodeRelationInputDto,
})
latestAiringEpisode?: CreateAnilistLatestAiringEpisodeRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAnilistNextAiringEpisodeRelationInputDto,
})
nextAiringEpisode?: CreateAnilistNextAiringEpisodeRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAnilistLastAiringEpisodeRelationInputDto,
})
lastAiringEpisode?: CreateAnilistLastAiringEpisodeRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAnilistRecommendationsRelationInputDto,
})
recommendations?: CreateAnilistRecommendationsRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAnilistCharactersRelationInputDto,
})
characters?: CreateAnilistCharactersRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAnilistStudiosRelationInputDto,
})
studios?: CreateAnilistStudiosRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAnilistAiringScheduleRelationInputDto,
})
airingSchedule?: CreateAnilistAiringScheduleRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAnilistTagsRelationInputDto,
})
tags?: CreateAnilistTagsRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAnilistRankingsRelationInputDto,
})
rankings?: CreateAnilistRankingsRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAnilistExternalLinksRelationInputDto,
})
externalLinks?: CreateAnilistExternalLinksRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAnilistStreamingEpisodesRelationInputDto,
})
streamingEpisodes?: CreateAnilistStreamingEpisodesRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAnilistScoreDistributionRelationInputDto,
})
scoreDistribution?: CreateAnilistScoreDistributionRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAnilistStatusDistributionRelationInputDto,
})
statusDistribution?: CreateAnilistStatusDistributionRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAnilistAnilibriaRelationInputDto,
})
anilibria?: CreateAnilistAnilibriaRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAnilistAnimepaheRelationInputDto,
})
animepahe?: CreateAnilistAnimepaheRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAnilistAnimekaiRelationInputDto,
})
animekai?: CreateAnilistAnimekaiRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAnilistZoroRelationInputDto,
})
zoro?: CreateAnilistZoroRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAnilistShikimoriRelationInputDto,
})
shikimori?: CreateAnilistShikimoriRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAnilistKitsuRelationInputDto,
})
kitsu?: CreateAnilistKitsuRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAnilistAnizipRelationInputDto,
})
anizip?: CreateAnilistAnizipRelationInputDto ;
}
