
import {ApiProperty} from '@nestjs/swagger'




export class UpdateTmdbSeasonStillImageDto {
  @ApiProperty({
  type: 'number',
  format: 'float',
  required: false,
  nullable: true,
})
aspect_ratio?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
height?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
width?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
iso_639_1?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
file_path?: string  | null;
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
