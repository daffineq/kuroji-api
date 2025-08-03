
import {ApiProperty} from '@nestjs/swagger'




export class UpdateAnilibriaGenreDto {
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
}
