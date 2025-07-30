
import {ApiProperty} from '@nestjs/swagger'


export class AnilibriaEpisodeDto {
  @ApiProperty({
  type: 'string',
})
id: string ;
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
}
