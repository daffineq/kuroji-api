
import {ApiProperty} from '@nestjs/swagger'


export class KitsuTitleDto {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
en: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
en_jp: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
ja_jp: string  | null;
}
