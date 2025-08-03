
import {ApiProperty} from '@nestjs/swagger'




export class UpdateAnilibriaEpisodeDto {
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
}
