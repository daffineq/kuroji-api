
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectZoroDto} from '../../zoro/dto/connect-zoro.dto'

export class CreateEpisodeZoroZoroRelationInputDto {
    @ApiProperty({
  type: ConnectZoroDto,
  isArray: true,
})
connect: ConnectZoroDto[] ;
  }

@ApiExtraModels(ConnectZoroDto,CreateEpisodeZoroZoroRelationInputDto)
export class CreateEpisodeZoroDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
number?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
title?: string  | null;
@ApiProperty({
  type: 'boolean',
  required: false,
  nullable: true,
})
isFiller?: boolean  | null;
@ApiProperty({
  type: 'boolean',
  required: false,
  nullable: true,
})
isSubbed?: boolean  | null;
@ApiProperty({
  type: 'boolean',
  required: false,
  nullable: true,
})
isDubbed?: boolean  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
url?: string  | null;
@ApiProperty({
  required: false,
  type: CreateEpisodeZoroZoroRelationInputDto,
})
zoro?: CreateEpisodeZoroZoroRelationInputDto ;
}
