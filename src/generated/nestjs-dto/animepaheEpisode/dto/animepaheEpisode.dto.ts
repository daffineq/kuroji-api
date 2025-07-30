
import {ApiProperty} from '@nestjs/swagger'


export class AnimepaheEpisodeDto {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
number: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
title: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
image: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
duration: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
url: string  | null;
}
