
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectAniZipDto} from '../../aniZip/dto/connect-aniZip.dto.js'

export class CreateAniZipMappingAniZipRelationInputDto {
    @ApiProperty({
  type: ConnectAniZipDto,
})
connect: ConnectAniZipDto ;
  }

@ApiExtraModels(ConnectAniZipDto,CreateAniZipMappingAniZipRelationInputDto)
export class CreateAniZipMappingDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
animePlanetId?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
kitsuId?: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
malId?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
type?: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
anilistId?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
anisearchId?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
anidbId?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
notifymoeId?: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
livechartId?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
thetvdbId?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
imdbId?: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
themoviedbId?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
anilibriaId?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
zoroId?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
animepaheId?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
animekaiId?: string  | null;
@ApiProperty({
  type: CreateAniZipMappingAniZipRelationInputDto,
})
aniZip: CreateAniZipMappingAniZipRelationInputDto ;
}
