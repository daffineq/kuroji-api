
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectAnilibriaTypeDto} from '../../anilibriaType/dto/connect-anilibriaType.dto.js'
import {ConnectAnilibriaNameDto} from '../../anilibriaName/dto/connect-anilibriaName.dto.js'
import {ConnectAnilibriaSeasonDto} from '../../anilibriaSeason/dto/connect-anilibriaSeason.dto.js'
import {ConnectAnilibriaPosterDto} from '../../anilibriaPoster/dto/connect-anilibriaPoster.dto.js'
import {ConnectAnilibriaAgeRatingDto} from '../../anilibriaAgeRating/dto/connect-anilibriaAgeRating.dto.js'
import {ConnectAnilibriaSponsorDto} from '../../anilibriaSponsor/dto/connect-anilibriaSponsor.dto.js'
import {ConnectAnilibriaPublishDayDto} from '../../anilibriaPublishDay/dto/connect-anilibriaPublishDay.dto.js'
import {CreateAnilibriaGenreEdgeDto} from '../../anilibriaGenreEdge/dto/create-anilibriaGenreEdge.dto.js'
import {ConnectAnilibriaGenreEdgeDto} from '../../anilibriaGenreEdge/dto/connect-anilibriaGenreEdge.dto.js'
import {CreateAnilibriaEpisodeDto} from '../../anilibriaEpisode/dto/create-anilibriaEpisode.dto.js'
import {ConnectAnilibriaEpisodeDto} from '../../anilibriaEpisode/dto/connect-anilibriaEpisode.dto.js'
import {CreateAnilibriaTorrentDto} from '../../anilibriaTorrent/dto/create-anilibriaTorrent.dto.js'
import {ConnectAnilibriaTorrentDto} from '../../anilibriaTorrent/dto/connect-anilibriaTorrent.dto.js'
import {ConnectAnilistDto} from '../../anilist/dto/connect-anilist.dto.js'

export class CreateAnilibriaTypeRelationInputDto {
    @ApiProperty({
  type: ConnectAnilibriaTypeDto,
})
connect: ConnectAnilibriaTypeDto ;
  }
export class CreateAnilibriaNameRelationInputDto {
    @ApiProperty({
  type: ConnectAnilibriaNameDto,
})
connect: ConnectAnilibriaNameDto ;
  }
export class CreateAnilibriaSeasonRelationInputDto {
    @ApiProperty({
  type: ConnectAnilibriaSeasonDto,
})
connect: ConnectAnilibriaSeasonDto ;
  }
export class CreateAnilibriaPosterRelationInputDto {
    @ApiProperty({
  type: ConnectAnilibriaPosterDto,
})
connect: ConnectAnilibriaPosterDto ;
  }
export class CreateAnilibriaAgeRatingRelationInputDto {
    @ApiProperty({
  type: ConnectAnilibriaAgeRatingDto,
})
connect: ConnectAnilibriaAgeRatingDto ;
  }
export class CreateAnilibriaSponsorRelationInputDto {
    @ApiProperty({
  type: ConnectAnilibriaSponsorDto,
})
connect: ConnectAnilibriaSponsorDto ;
  }
export class CreateAnilibriaPublishDayRelationInputDto {
    @ApiProperty({
  type: ConnectAnilibriaPublishDayDto,
})
connect: ConnectAnilibriaPublishDayDto ;
  }
export class CreateAnilibriaGenresRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateAnilibriaGenreEdgeDto,
  isArray: true,
})
create?: CreateAnilibriaGenreEdgeDto[] ;
@ApiProperty({
  required: false,
  type: ConnectAnilibriaGenreEdgeDto,
  isArray: true,
})
connect?: ConnectAnilibriaGenreEdgeDto[] ;
  }
export class CreateAnilibriaEpisodesRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateAnilibriaEpisodeDto,
  isArray: true,
})
create?: CreateAnilibriaEpisodeDto[] ;
@ApiProperty({
  required: false,
  type: ConnectAnilibriaEpisodeDto,
  isArray: true,
})
connect?: ConnectAnilibriaEpisodeDto[] ;
  }
export class CreateAnilibriaTorrentsRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateAnilibriaTorrentDto,
  isArray: true,
})
create?: CreateAnilibriaTorrentDto[] ;
@ApiProperty({
  required: false,
  type: ConnectAnilibriaTorrentDto,
  isArray: true,
})
connect?: ConnectAnilibriaTorrentDto[] ;
  }
export class CreateAnilibriaAnilistRelationInputDto {
    @ApiProperty({
  type: ConnectAnilistDto,
})
connect: ConnectAnilistDto ;
  }

@ApiExtraModels(ConnectAnilibriaTypeDto,CreateAnilibriaTypeRelationInputDto,ConnectAnilibriaNameDto,CreateAnilibriaNameRelationInputDto,ConnectAnilibriaSeasonDto,CreateAnilibriaSeasonRelationInputDto,ConnectAnilibriaPosterDto,CreateAnilibriaPosterRelationInputDto,ConnectAnilibriaAgeRatingDto,CreateAnilibriaAgeRatingRelationInputDto,ConnectAnilibriaSponsorDto,CreateAnilibriaSponsorRelationInputDto,ConnectAnilibriaPublishDayDto,CreateAnilibriaPublishDayRelationInputDto,CreateAnilibriaGenreEdgeDto,ConnectAnilibriaGenreEdgeDto,CreateAnilibriaGenresRelationInputDto,CreateAnilibriaEpisodeDto,ConnectAnilibriaEpisodeDto,CreateAnilibriaEpisodesRelationInputDto,CreateAnilibriaTorrentDto,ConnectAnilibriaTorrentDto,CreateAnilibriaTorrentsRelationInputDto,ConnectAnilistDto,CreateAnilibriaAnilistRelationInputDto)
export class CreateAnilibriaDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
year?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
alias?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
fresh_at?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
created_at?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
updated_at?: string  | null;
@ApiProperty({
  type: 'boolean',
  required: false,
  nullable: true,
})
is_ongoing?: boolean  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
description?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
notification?: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
episodes_total?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
external_player?: string  | null;
@ApiProperty({
  type: 'boolean',
  required: false,
  nullable: true,
})
is_in_production?: boolean  | null;
@ApiProperty({
  type: 'boolean',
  required: false,
  nullable: true,
})
is_blocked_by_copyrights?: boolean  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
added_in_users_favorites?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
average_duration_of_episode?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
added_in_planned_collection?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
added_in_watched_collection?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
added_in_watching_collection?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
added_in_postponed_collection?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
added_in_abandoned_collection?: number  | null;
@ApiProperty({
  required: false,
  type: CreateAnilibriaTypeRelationInputDto,
})
type?: CreateAnilibriaTypeRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAnilibriaNameRelationInputDto,
})
name?: CreateAnilibriaNameRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAnilibriaSeasonRelationInputDto,
})
season?: CreateAnilibriaSeasonRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAnilibriaPosterRelationInputDto,
})
poster?: CreateAnilibriaPosterRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAnilibriaAgeRatingRelationInputDto,
})
age_rating?: CreateAnilibriaAgeRatingRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAnilibriaSponsorRelationInputDto,
})
sponsor?: CreateAnilibriaSponsorRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAnilibriaPublishDayRelationInputDto,
})
publish_day?: CreateAnilibriaPublishDayRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAnilibriaGenresRelationInputDto,
})
genres?: CreateAnilibriaGenresRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAnilibriaEpisodesRelationInputDto,
})
episodes?: CreateAnilibriaEpisodesRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAnilibriaTorrentsRelationInputDto,
})
torrents?: CreateAnilibriaTorrentsRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAnilibriaAnilistRelationInputDto,
})
anilist?: CreateAnilibriaAnilistRelationInputDto ;
}
