
import {ApiProperty} from '@nestjs/swagger'




export class UpdateAnilibriaTorrentCodecDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
value?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
label?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
description?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
label_color?: string  | null;
@ApiProperty({
  type: 'boolean',
  required: false,
  nullable: true,
})
label_is_visible?: boolean  | null;
}
