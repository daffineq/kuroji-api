
import {ApiProperty} from '@nestjs/swagger'


export class AnilibriaPosterDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
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
}
