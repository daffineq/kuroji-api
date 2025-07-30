
import {ApiProperty} from '@nestjs/swagger'




export class UpdateTmdbSeasonDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
air_date?: string  | null;
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
overview?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
poster_path?: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
})
season_number?: number ;
@ApiProperty({
  type: 'number',
  format: 'float',
  required: false,
  nullable: true,
})
vote_average?: number  | null;
}
