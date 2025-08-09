
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectAnilibriaEpisodeDto} from '../../anilibriaEpisode/dto/connect-anilibriaEpisode.dto'

export class CreateAnilibriaEpisodePreviewEpisodeRelationInputDto {
    @ApiProperty({
  type: ConnectAnilibriaEpisodeDto,
})
connect: ConnectAnilibriaEpisodeDto ;
  }

@ApiExtraModels(ConnectAnilibriaEpisodeDto,CreateAnilibriaEpisodePreviewEpisodeRelationInputDto)
export class CreateAnilibriaEpisodePreviewDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
preview?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
thumbnail?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
optimized_preview?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
optimized_thumbnail?: string  | null;
@ApiProperty({
  type: CreateAnilibriaEpisodePreviewEpisodeRelationInputDto,
})
episode: CreateAnilibriaEpisodePreviewEpisodeRelationInputDto ;
}
