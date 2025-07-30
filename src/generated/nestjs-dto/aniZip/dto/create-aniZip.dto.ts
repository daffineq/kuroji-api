
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {CreateAniZipTitleDto} from '../../aniZipTitle/dto/create-aniZipTitle.dto.js'
import {ConnectAniZipTitleDto} from '../../aniZipTitle/dto/connect-aniZipTitle.dto.js'
import {CreateAniZipImageDto} from '../../aniZipImage/dto/create-aniZipImage.dto.js'
import {ConnectAniZipImageDto} from '../../aniZipImage/dto/connect-aniZipImage.dto.js'
import {CreateAniZipEpisodeDto} from '../../aniZipEpisode/dto/create-aniZipEpisode.dto.js'
import {ConnectAniZipEpisodeDto} from '../../aniZipEpisode/dto/connect-aniZipEpisode.dto.js'
import {CreateAniZipMappingDto} from '../../aniZipMapping/dto/create-aniZipMapping.dto.js'
import {ConnectAniZipMappingDto} from '../../aniZipMapping/dto/connect-aniZipMapping.dto.js'
import {ConnectAnilistDto} from '../../anilist/dto/connect-anilist.dto.js'

export class CreateAniZipTitlesRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateAniZipTitleDto,
  isArray: true,
})
create?: CreateAniZipTitleDto[] ;
@ApiProperty({
  required: false,
  type: ConnectAniZipTitleDto,
  isArray: true,
})
connect?: ConnectAniZipTitleDto[] ;
  }
export class CreateAniZipImagesRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateAniZipImageDto,
  isArray: true,
})
create?: CreateAniZipImageDto[] ;
@ApiProperty({
  required: false,
  type: ConnectAniZipImageDto,
  isArray: true,
})
connect?: ConnectAniZipImageDto[] ;
  }
export class CreateAniZipEpisodesRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateAniZipEpisodeDto,
  isArray: true,
})
create?: CreateAniZipEpisodeDto[] ;
@ApiProperty({
  required: false,
  type: ConnectAniZipEpisodeDto,
  isArray: true,
})
connect?: ConnectAniZipEpisodeDto[] ;
  }
export class CreateAniZipMappingsRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateAniZipMappingDto,
})
create?: CreateAniZipMappingDto ;
@ApiProperty({
  required: false,
  type: ConnectAniZipMappingDto,
})
connect?: ConnectAniZipMappingDto ;
  }
export class CreateAniZipAnilistRelationInputDto {
    @ApiProperty({
  type: ConnectAnilistDto,
})
connect: ConnectAnilistDto ;
  }

@ApiExtraModels(CreateAniZipTitleDto,ConnectAniZipTitleDto,CreateAniZipTitlesRelationInputDto,CreateAniZipImageDto,ConnectAniZipImageDto,CreateAniZipImagesRelationInputDto,CreateAniZipEpisodeDto,ConnectAniZipEpisodeDto,CreateAniZipEpisodesRelationInputDto,CreateAniZipMappingDto,ConnectAniZipMappingDto,CreateAniZipMappingsRelationInputDto,ConnectAnilistDto,CreateAniZipAnilistRelationInputDto)
export class CreateAniZipDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
episodeCount: number ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
})
specialCount: number ;
@ApiProperty({
  required: false,
  type: CreateAniZipTitlesRelationInputDto,
})
titles?: CreateAniZipTitlesRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAniZipImagesRelationInputDto,
})
images?: CreateAniZipImagesRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAniZipEpisodesRelationInputDto,
})
episodes?: CreateAniZipEpisodesRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAniZipMappingsRelationInputDto,
})
mappings?: CreateAniZipMappingsRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAniZipAnilistRelationInputDto,
})
anilist?: CreateAniZipAnilistRelationInputDto ;
}
