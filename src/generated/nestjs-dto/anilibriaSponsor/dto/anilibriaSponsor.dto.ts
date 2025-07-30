
import {ApiProperty} from '@nestjs/swagger'


export class AnilibriaSponsorDto {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
title: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
description: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
url_title: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
url: string  | null;
}
