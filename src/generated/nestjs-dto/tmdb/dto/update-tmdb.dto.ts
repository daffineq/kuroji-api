
import {ApiProperty} from '@nestjs/swagger'




export class UpdateTmdbDto {
  @ApiProperty({
  type: 'boolean',
  required: false,
})
adult?: boolean ;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
backdrop_path?: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  isArray: true,
  required: false,
})
episode_run_time?: number[] ;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
media_type?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
first_air_date?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
homepage?: string  | null;
@ApiProperty({
  type: 'boolean',
  required: false,
  nullable: true,
})
in_production?: boolean  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
last_air_date?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
name?: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
number_of_episodes?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
number_of_seasons?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
original_language?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
original_name?: string  | null;
@ApiProperty({
  type: 'string',
  isArray: true,
  required: false,
})
origin_country?: string[] ;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
overview?: string  | null;
@ApiProperty({
  type: 'number',
  format: 'float',
  required: false,
  nullable: true,
})
popularity?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
poster_path?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
tagline?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
status?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
type?: string  | null;
@ApiProperty({
  type: 'number',
  format: 'float',
  required: false,
  nullable: true,
})
vote_average?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
vote_count?: number  | null;
}
