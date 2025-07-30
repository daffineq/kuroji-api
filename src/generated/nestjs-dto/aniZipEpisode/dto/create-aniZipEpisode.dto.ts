
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {CreateAniZipEpisodeTitleDto} from '../../aniZipEpisodeTitle/dto/create-aniZipEpisodeTitle.dto.js'
import {ConnectAniZipEpisodeTitleDto} from '../../aniZipEpisodeTitle/dto/connect-aniZipEpisodeTitle.dto.js'
import {ConnectAniZipDto} from '../../aniZip/dto/connect-aniZip.dto.js'

export class CreateAniZipEpisodeTitlesRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateAniZipEpisodeTitleDto,
  isArray: true,
})
create?: CreateAniZipEpisodeTitleDto[] ;
@ApiProperty({
  required: false,
  type: ConnectAniZipEpisodeTitleDto,
  isArray: true,
})
connect?: ConnectAniZipEpisodeTitleDto[] ;
  }
export class CreateAniZipEpisodeAniZipRelationInputDto {
    @ApiProperty({
  type: ConnectAniZipDto,
})
connect: ConnectAniZipDto ;
  }

@ApiExtraModels(CreateAniZipEpisodeTitleDto,ConnectAniZipEpisodeTitleDto,CreateAniZipEpisodeTitlesRelationInputDto,ConnectAniZipDto,CreateAniZipEpisodeAniZipRelationInputDto)
export class CreateAniZipEpisodeDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
episodeKey?: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
episodeNumber?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
seasonNumber?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
absoluteEpisodeNumber?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
tvdbShowId?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
tvdbId?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
airDate?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
airDateUtc?: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
runtime?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
length?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
overview?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
image?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
rating?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
episode?: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
anidbEid?: number  | null;
@ApiProperty({
  required: false,
  type: CreateAniZipEpisodeTitlesRelationInputDto,
})
titles?: CreateAniZipEpisodeTitlesRelationInputDto ;
@ApiProperty({
  type: CreateAniZipEpisodeAniZipRelationInputDto,
})
aniZip: CreateAniZipEpisodeAniZipRelationInputDto ;
}
