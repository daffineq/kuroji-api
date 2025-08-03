
import {ApiProperty} from '@nestjs/swagger'
import {AnilistTitle} from '../../anilistTitle/entities/anilistTitle.entity.js'
import {AnilistCover} from '../../anilistCover/entities/anilistCover.entity.js'
import {StartDate} from '../../startDate/entities/startDate.entity.js'
import {EndDate} from '../../endDate/entities/endDate.entity.js'
import {AnilistTrailer} from '../../anilistTrailer/entities/anilistTrailer.entity.js'
import {AnilistLatestEpisode} from '../../anilistLatestEpisode/entities/anilistLatestEpisode.entity.js'
import {AnilistNextEpisode} from '../../anilistNextEpisode/entities/anilistNextEpisode.entity.js'
import {AnilistLastEpisode} from '../../anilistLastEpisode/entities/anilistLastEpisode.entity.js'
import {BasicIdAni} from '../../basicIdAni/entities/basicIdAni.entity.js'
import {AnilistCharacterEdge} from '../../anilistCharacterEdge/entities/anilistCharacterEdge.entity.js'
import {AnilistStudioEdge} from '../../anilistStudioEdge/entities/anilistStudioEdge.entity.js'
import {AnilistAiringSchedule} from '../../anilistAiringSchedule/entities/anilistAiringSchedule.entity.js'
import {AnilistTagEdge} from '../../anilistTagEdge/entities/anilistTagEdge.entity.js'
import {AnilistRanking} from '../../anilistRanking/entities/anilistRanking.entity.js'
import {AnilistExternalLink} from '../../anilistExternalLink/entities/anilistExternalLink.entity.js'
import {AnilistStreamingEpisode} from '../../anilistStreamingEpisode/entities/anilistStreamingEpisode.entity.js'
import {AnilistScoreDistribution} from '../../anilistScoreDistribution/entities/anilistScoreDistribution.entity.js'
import {AnilistStatusDistribution} from '../../anilistStatusDistribution/entities/anilistStatusDistribution.entity.js'
import {Anilibria} from '../../anilibria/entities/anilibria.entity.js'
import {Animepahe} from '../../animepahe/entities/animepahe.entity.js'
import {AnimeKai} from '../../animeKai/entities/animeKai.entity.js'
import {Zoro} from '../../zoro/entities/zoro.entity.js'
import {Shikimori} from '../../shikimori/entities/shikimori.entity.js'
import {Kitsu} from '../../kitsu/entities/kitsu.entity.js'
import {AniZip} from '../../aniZip/entities/aniZip.entity.js'


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
  type: () => Object,
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
  type: () => Object,
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
  type: () => Object,
  required: false,
  nullable: true,
})
startDate?: StartDate  | null;
@ApiProperty({
  type: () => Object,
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
  type: () => Object,
  required: false,
  nullable: true,
})
trailer?: AnilistTrailer  | null;
@ApiProperty({
  type: () => Object,
  required: false,
  nullable: true,
})
latestAiringEpisode?: AnilistLatestEpisode  | null;
@ApiProperty({
  type: () => Object,
  required: false,
  nullable: true,
})
nextAiringEpisode?: AnilistNextEpisode  | null;
@ApiProperty({
  type: () => Object,
  required: false,
  nullable: true,
})
lastAiringEpisode?: AnilistLastEpisode  | null;
@ApiProperty({
  type: () => Object,
  isArray: true,
  required: false,
})
recommendations?: BasicIdAni[] ;
@ApiProperty({
  type: () => Object,
  isArray: true,
  required: false,
})
characters?: AnilistCharacterEdge[] ;
@ApiProperty({
  type: () => Object,
  isArray: true,
  required: false,
})
studios?: AnilistStudioEdge[] ;
@ApiProperty({
  type: () => Object,
  isArray: true,
  required: false,
})
airingSchedule?: AnilistAiringSchedule[] ;
@ApiProperty({
  type: () => Object,
  isArray: true,
  required: false,
})
tags?: AnilistTagEdge[] ;
@ApiProperty({
  type: () => Object,
  isArray: true,
  required: false,
})
rankings?: AnilistRanking[] ;
@ApiProperty({
  type: () => Object,
  isArray: true,
  required: false,
})
externalLinks?: AnilistExternalLink[] ;
@ApiProperty({
  type: () => Object,
  isArray: true,
  required: false,
})
streamingEpisodes?: AnilistStreamingEpisode[] ;
@ApiProperty({
  type: () => Object,
  isArray: true,
  required: false,
})
scoreDistribution?: AnilistScoreDistribution[] ;
@ApiProperty({
  type: () => Object,
  isArray: true,
  required: false,
})
statusDistribution?: AnilistStatusDistribution[] ;
@ApiProperty({
  type: () => Object,
  required: false,
  nullable: true,
})
anilibria?: Anilibria  | null;
@ApiProperty({
  type: () => Object,
  required: false,
  nullable: true,
})
animepahe?: Animepahe  | null;
@ApiProperty({
  type: () => Object,
  required: false,
  nullable: true,
})
animekai?: AnimeKai  | null;
@ApiProperty({
  type: () => Object,
  required: false,
  nullable: true,
})
zoro?: Zoro  | null;
@ApiProperty({
  type: () => Object,
  required: false,
  nullable: true,
})
shikimori?: Shikimori  | null;
@ApiProperty({
  type: () => Object,
  required: false,
  nullable: true,
})
kitsu?: Kitsu  | null;
@ApiProperty({
  type: () => Object,
  required: false,
  nullable: true,
})
anizip?: AniZip  | null;
}
