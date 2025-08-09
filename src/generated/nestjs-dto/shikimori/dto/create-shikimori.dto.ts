
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectShikimoriPosterDto} from '../../shikimoriPoster/dto/connect-shikimoriPoster.dto'
import {ConnectAiredOnDto} from '../../airedOn/dto/connect-airedOn.dto'
import {ConnectReleasedOnDto} from '../../releasedOn/dto/connect-releasedOn.dto'
import {CreateBasicIdShikDto} from '../../basicIdShik/dto/create-basicIdShik.dto'
import {ConnectBasicIdShikDto} from '../../basicIdShik/dto/connect-basicIdShik.dto'
import {CreateShikimoriVideoDto} from '../../shikimoriVideo/dto/create-shikimoriVideo.dto'
import {ConnectShikimoriVideoDto} from '../../shikimoriVideo/dto/connect-shikimoriVideo.dto'
import {CreateShikimoriScreenshotDto} from '../../shikimoriScreenshot/dto/create-shikimoriScreenshot.dto'
import {ConnectShikimoriScreenshotDto} from '../../shikimoriScreenshot/dto/connect-shikimoriScreenshot.dto'
import {ConnectAnilistDto} from '../../anilist/dto/connect-anilist.dto'

export class CreateShikimoriPosterRelationInputDto {
    @ApiProperty({
  type: ConnectShikimoriPosterDto,
})
connect: ConnectShikimoriPosterDto ;
  }
export class CreateShikimoriAiredOnRelationInputDto {
    @ApiProperty({
  type: ConnectAiredOnDto,
})
connect: ConnectAiredOnDto ;
  }
export class CreateShikimoriReleasedOnRelationInputDto {
    @ApiProperty({
  type: ConnectReleasedOnDto,
})
connect: ConnectReleasedOnDto ;
  }
export class CreateShikimoriChronologyRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateBasicIdShikDto,
  isArray: true,
})
create?: CreateBasicIdShikDto[] ;
@ApiProperty({
  required: false,
  type: ConnectBasicIdShikDto,
  isArray: true,
})
connect?: ConnectBasicIdShikDto[] ;
  }
export class CreateShikimoriVideosRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateShikimoriVideoDto,
  isArray: true,
})
create?: CreateShikimoriVideoDto[] ;
@ApiProperty({
  required: false,
  type: ConnectShikimoriVideoDto,
  isArray: true,
})
connect?: ConnectShikimoriVideoDto[] ;
  }
export class CreateShikimoriScreenshotsRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateShikimoriScreenshotDto,
  isArray: true,
})
create?: CreateShikimoriScreenshotDto[] ;
@ApiProperty({
  required: false,
  type: ConnectShikimoriScreenshotDto,
  isArray: true,
})
connect?: ConnectShikimoriScreenshotDto[] ;
  }
export class CreateShikimoriAnilistRelationInputDto {
    @ApiProperty({
  type: ConnectAnilistDto,
})
connect: ConnectAnilistDto ;
  }

@ApiExtraModels(ConnectShikimoriPosterDto,CreateShikimoriPosterRelationInputDto,ConnectAiredOnDto,CreateShikimoriAiredOnRelationInputDto,ConnectReleasedOnDto,CreateShikimoriReleasedOnRelationInputDto,CreateBasicIdShikDto,ConnectBasicIdShikDto,CreateShikimoriChronologyRelationInputDto,CreateShikimoriVideoDto,ConnectShikimoriVideoDto,CreateShikimoriVideosRelationInputDto,CreateShikimoriScreenshotDto,ConnectShikimoriScreenshotDto,CreateShikimoriScreenshotsRelationInputDto,ConnectAnilistDto,CreateShikimoriAnilistRelationInputDto)
export class CreateShikimoriDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
name?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
russian?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
licenseNameRu?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
english?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
japanese?: string  | null;
@ApiProperty({
  required: false,
  type: CreateShikimoriPosterRelationInputDto,
})
poster?: CreateShikimoriPosterRelationInputDto ;
@ApiProperty({
  type: 'string',
  isArray: true,
})
synonyms: string[] ;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
kind?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
rating?: string  | null;
@ApiProperty({
  type: 'number',
  format: 'float',
  required: false,
  nullable: true,
})
score?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
status?: string  | null;
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
episodesAired?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
duration?: number  | null;
@ApiProperty({
  required: false,
  type: CreateShikimoriAiredOnRelationInputDto,
})
airedOn?: CreateShikimoriAiredOnRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateShikimoriReleasedOnRelationInputDto,
})
releasedOn?: CreateShikimoriReleasedOnRelationInputDto ;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
franchise?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
url?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
season?: string  | null;
@ApiProperty({
  type: 'string',
  format: 'date-time',
  required: false,
  nullable: true,
})
createdAt?: Date  | null;
@ApiProperty({
  type: 'string',
  format: 'date-time',
  required: false,
  nullable: true,
})
updatedAt?: Date  | null;
@ApiProperty({
  type: 'string',
  format: 'date-time',
  required: false,
  nullable: true,
})
nextEpisodeAt?: Date  | null;
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
descriptionHtml?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
descriptionSource?: string  | null;
@ApiProperty({
  required: false,
  type: CreateShikimoriChronologyRelationInputDto,
})
chronology?: CreateShikimoriChronologyRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateShikimoriVideosRelationInputDto,
})
videos?: CreateShikimoriVideosRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateShikimoriScreenshotsRelationInputDto,
})
screenshots?: CreateShikimoriScreenshotsRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateShikimoriAnilistRelationInputDto,
})
anilist?: CreateShikimoriAnilistRelationInputDto ;
}
