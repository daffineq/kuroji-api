
import {ApiProperty} from '@nestjs/swagger'


export class TitleDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
romaji: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
english: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
native: string  | null;
}
