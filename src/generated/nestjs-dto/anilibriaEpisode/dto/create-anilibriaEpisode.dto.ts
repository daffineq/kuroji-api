
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectAnilibriaDto} from '../../anilibria/dto/connect-anilibria.dto.js'
import {ConnectAnilibriaEpisodeEndingDto} from '../../anilibriaEpisodeEnding/dto/connect-anilibriaEpisodeEnding.dto.js'
import {ConnectAnilibriaEpisodeOpeningDto} from '../../anilibriaEpisodeOpening/dto/connect-anilibriaEpisodeOpening.dto.js'
import {ConnectAnilibriaEpisodePreviewDto} from '../../anilibriaEpisodePreview/dto/connect-anilibriaEpisodePreview.dto.js'

export class CreateAnilibriaEpisodeAnilibriaRelationInputDto {
    @ApiProperty({
  type: ConnectAnilibriaDto,
})
connect: ConnectAnilibriaDto ;
  }
export class CreateAnilibriaEpisodeEndingRelationInputDto {
    @ApiProperty({
  type: ConnectAnilibriaEpisodeEndingDto,
})
connect: ConnectAnilibriaEpisodeEndingDto ;
  }
export class CreateAnilibriaEpisodeOpeningRelationInputDto {
    @ApiProperty({
  type: ConnectAnilibriaEpisodeOpeningDto,
})
connect: ConnectAnilibriaEpisodeOpeningDto ;
  }
export class CreateAnilibriaEpisodePreviewRelationInputDto {
    @ApiProperty({
  type: ConnectAnilibriaEpisodePreviewDto,
})
connect: ConnectAnilibriaEpisodePreviewDto ;
  }

@ApiExtraModels(ConnectAnilibriaDto,CreateAnilibriaEpisodeAnilibriaRelationInputDto,ConnectAnilibriaEpisodeEndingDto,CreateAnilibriaEpisodeEndingRelationInputDto,ConnectAnilibriaEpisodeOpeningDto,CreateAnilibriaEpisodeOpeningRelationInputDto,ConnectAnilibriaEpisodePreviewDto,CreateAnilibriaEpisodePreviewRelationInputDto)
export class CreateAnilibriaEpisodeDto {
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
name_english?: string  | null;
@ApiProperty({
  type: 'number',
  format: 'float',
  required: false,
  nullable: true,
})
ordinal?: number  | null;
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
rutube_id?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
youtube_id?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
updated_at?: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
sort_order?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
release_id?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
hls_480?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
hls_720?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
hls_1080?: string  | null;
@ApiProperty({
  type: CreateAnilibriaEpisodeAnilibriaRelationInputDto,
})
anilibria: CreateAnilibriaEpisodeAnilibriaRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAnilibriaEpisodeEndingRelationInputDto,
})
ending?: CreateAnilibriaEpisodeEndingRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAnilibriaEpisodeOpeningRelationInputDto,
})
opening?: CreateAnilibriaEpisodeOpeningRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAnilibriaEpisodePreviewRelationInputDto,
})
preview?: CreateAnilibriaEpisodePreviewRelationInputDto ;
}
