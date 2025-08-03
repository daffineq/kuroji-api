
import {ApiProperty} from '@nestjs/swagger'


export class AnilibriaTorrentCodecDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
value: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
label: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
description: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
label_color: string  | null;
@ApiProperty({
  type: 'boolean',
  nullable: true,
})
label_is_visible: boolean  | null;
}
