
import {ApiProperty} from '@nestjs/swagger'




export class UpdateAnilibriaSponsorDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
title?: string  | null;
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
url_title?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
url?: string  | null;
}
