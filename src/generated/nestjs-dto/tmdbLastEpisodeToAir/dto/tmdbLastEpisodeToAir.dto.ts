
import {ApiProperty} from '@nestjs/swagger'


export class TmdbLastEpisodeToAirDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
name: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
overview: string  | null;
@ApiProperty({
  type: 'number',
  format: 'float',
  nullable: true,
})
vote_average: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
vote_count: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
air_date: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
episode_number: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
episode_type: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
production_code: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
runtime: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
season_number: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
still_path: string  | null;
}
