
import {ApiProperty} from '@nestjs/swagger'
import {Anilibria} from '../../anilibria/entities/anilibria.entity'
import {AnilibriaEpisodeEnding} from '../../anilibriaEpisodeEnding/entities/anilibriaEpisodeEnding.entity'
import {AnilibriaEpisodeOpening} from '../../anilibriaEpisodeOpening/entities/anilibriaEpisodeOpening.entity'
import {AnilibriaEpisodePreview} from '../../anilibriaEpisodePreview/entities/anilibriaEpisodePreview.entity'


export class AnilibriaEpisode {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
})
anilibriaId: number ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
name: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
name_english: string  | null;
@ApiProperty({
  type: 'number',
  format: 'float',
  nullable: true,
})
ordinal: number  | null;
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
rutube_id: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
youtube_id: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
updated_at: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
sort_order: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
release_id: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
hls_480: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
hls_720: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
hls_1080: string  | null;
@ApiProperty({
  type: () => Anilibria,
  required: false,
})
anilibria?: Anilibria ;
@ApiProperty({
  type: () => AnilibriaEpisodeEnding,
  required: false,
  nullable: true,
})
ending?: AnilibriaEpisodeEnding  | null;
@ApiProperty({
  type: () => AnilibriaEpisodeOpening,
  required: false,
  nullable: true,
})
opening?: AnilibriaEpisodeOpening  | null;
@ApiProperty({
  type: () => AnilibriaEpisodePreview,
  required: false,
  nullable: true,
})
preview?: AnilibriaEpisodePreview  | null;
}
