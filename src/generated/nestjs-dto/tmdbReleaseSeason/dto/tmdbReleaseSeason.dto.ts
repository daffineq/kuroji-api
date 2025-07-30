
import {ApiProperty} from '@nestjs/swagger'


export class TmdbReleaseSeasonDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
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
episode_count: number  | null;
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
  type: 'string',
  nullable: true,
})
poster_path: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
})
season_number: number ;
@ApiProperty({
  type: 'number',
  format: 'float',
  nullable: true,
})
vote_average: number  | null;
}
