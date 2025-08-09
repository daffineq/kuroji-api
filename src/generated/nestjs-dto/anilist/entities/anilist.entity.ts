
import {ApiProperty} from '@nestjs/swagger'
import {AnilistTitle} from '../../anilistTitle/entities/anilistTitle.entity'
import {AnilistCover} from '../../anilistCover/entities/anilistCover.entity'
import {StartDate} from '../../startDate/entities/startDate.entity'
import {EndDate} from '../../endDate/entities/endDate.entity'
import {AnilistTrailer} from '../../anilistTrailer/entities/anilistTrailer.entity'
import {AnilistLatestEpisode} from '../../anilistLatestEpisode/entities/anilistLatestEpisode.entity'
import {AnilistNextEpisode} from '../../anilistNextEpisode/entities/anilistNextEpisode.entity'
import {AnilistLastEpisode} from '../../anilistLastEpisode/entities/anilistLastEpisode.entity'
import {BasicIdAni} from '../../basicIdAni/entities/basicIdAni.entity'
import {AnilistCharacterEdge} from '../../anilistCharacterEdge/entities/anilistCharacterEdge.entity'
import {AnilistStudioEdge} from '../../anilistStudioEdge/entities/anilistStudioEdge.entity'
import {AnilistAiringSchedule} from '../../anilistAiringSchedule/entities/anilistAiringSchedule.entity'
import {AnilistTagEdge} from '../../anilistTagEdge/entities/anilistTagEdge.entity'
import {AnilistRanking} from '../../anilistRanking/entities/anilistRanking.entity'
import {AnilistExternalLink} from '../../anilistExternalLink/entities/anilistExternalLink.entity'
import {AnilistStreamingEpisode} from '../../anilistStreamingEpisode/entities/anilistStreamingEpisode.entity'
import {AnilistScoreDistribution} from '../../anilistScoreDistribution/entities/anilistScoreDistribution.entity'
import {AnilistStatusDistribution} from '../../anilistStatusDistribution/entities/anilistStatusDistribution.entity'
import {Anilibria} from '../../anilibria/entities/anilibria.entity'
import {Animepahe} from '../../animepahe/entities/animepahe.entity'
import {AnimeKai} from '../../animeKai/entities/animeKai.entity'
import {Zoro} from '../../zoro/entities/zoro.entity'
import {Shikimori} from '../../shikimori/entities/shikimori.entity'
import {Kitsu} from '../../kitsu/entities/kitsu.entity'
import {AniZip} from '../../aniZip/entities/aniZip.entity'


export class Anilist {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
idMal: number  | null;
@ApiProperty({
  type: () => AnilistTitle,
  required: false,
  nullable: true,
})
title?: AnilistTitle  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
bannerImage: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
status: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
type: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
format: string  | null;
@ApiProperty({
  type: () => AnilistCover,
  required: false,
  nullable: true,
})
coverImage?: AnilistCover  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
updatedAt: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
description: string  | null;
@ApiProperty({
  type: () => StartDate,
  required: false,
  nullable: true,
})
startDate?: StartDate  | null;
@ApiProperty({
  type: () => EndDate,
  required: false,
  nullable: true,
})
endDate?: EndDate  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
season: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
seasonYear: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
episodes: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
duration: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
countryOfOrigin: string  | null;
@ApiProperty({
  type: 'boolean',
  nullable: true,
})
isLicensed: boolean  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
source: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
hashtag: string  | null;
@ApiProperty({
  type: 'boolean',
  nullable: true,
})
isLocked: boolean  | null;
@ApiProperty({
  type: 'boolean',
  nullable: true,
})
isAdult: boolean  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
averageScore: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
meanScore: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
score: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
popularity: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
trending: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
favourites: number  | null;
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
  type: () => AnilistTrailer,
  required: false,
  nullable: true,
})
trailer?: AnilistTrailer  | null;
@ApiProperty({
  type: () => AnilistLatestEpisode,
  required: false,
  nullable: true,
})
latestAiringEpisode?: AnilistLatestEpisode  | null;
@ApiProperty({
  type: () => AnilistNextEpisode,
  required: false,
  nullable: true,
})
nextAiringEpisode?: AnilistNextEpisode  | null;
@ApiProperty({
  type: () => AnilistLastEpisode,
  required: false,
  nullable: true,
})
lastAiringEpisode?: AnilistLastEpisode  | null;
@ApiProperty({
  type: () => BasicIdAni,
  isArray: true,
  required: false,
})
recommendations?: BasicIdAni[] ;
@ApiProperty({
  type: () => AnilistCharacterEdge,
  isArray: true,
  required: false,
})
characters?: AnilistCharacterEdge[] ;
@ApiProperty({
  type: () => AnilistStudioEdge,
  isArray: true,
  required: false,
})
studios?: AnilistStudioEdge[] ;
@ApiProperty({
  type: () => AnilistAiringSchedule,
  isArray: true,
  required: false,
})
airingSchedule?: AnilistAiringSchedule[] ;
@ApiProperty({
  type: () => AnilistTagEdge,
  isArray: true,
  required: false,
})
tags?: AnilistTagEdge[] ;
@ApiProperty({
  type: () => AnilistRanking,
  isArray: true,
  required: false,
})
rankings?: AnilistRanking[] ;
@ApiProperty({
  type: () => AnilistExternalLink,
  isArray: true,
  required: false,
})
externalLinks?: AnilistExternalLink[] ;
@ApiProperty({
  type: () => AnilistStreamingEpisode,
  isArray: true,
  required: false,
})
streamingEpisodes?: AnilistStreamingEpisode[] ;
@ApiProperty({
  type: () => AnilistScoreDistribution,
  isArray: true,
  required: false,
})
scoreDistribution?: AnilistScoreDistribution[] ;
@ApiProperty({
  type: () => AnilistStatusDistribution,
  isArray: true,
  required: false,
})
statusDistribution?: AnilistStatusDistribution[] ;
@ApiProperty({
  type: () => Anilibria,
  required: false,
  nullable: true,
})
anilibria?: Anilibria  | null;
@ApiProperty({
  type: () => Animepahe,
  required: false,
  nullable: true,
})
animepahe?: Animepahe  | null;
@ApiProperty({
  type: () => AnimeKai,
  required: false,
  nullable: true,
})
animekai?: AnimeKai  | null;
@ApiProperty({
  type: () => Zoro,
  required: false,
  nullable: true,
})
zoro?: Zoro  | null;
@ApiProperty({
  type: () => Shikimori,
  required: false,
  nullable: true,
})
shikimori?: Shikimori  | null;
@ApiProperty({
  type: () => Kitsu,
  required: false,
  nullable: true,
})
kitsu?: Kitsu  | null;
@ApiProperty({
  type: () => AniZip,
  required: false,
  nullable: true,
})
anizip?: AniZip  | null;
}
