
import {ApiProperty} from '@nestjs/swagger'
import {AnilibriaEpisode} from '../../anilibriaEpisode/entities/anilibriaEpisode.entity'


export class AnilibriaEpisodePreview {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'string',
})
episodeId: string ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
preview: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
thumbnail: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
optimized_preview: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
optimized_thumbnail: string  | null;
@ApiProperty({
  type: () => AnilibriaEpisode,
  required: false,
})
episode?: AnilibriaEpisode ;
}
