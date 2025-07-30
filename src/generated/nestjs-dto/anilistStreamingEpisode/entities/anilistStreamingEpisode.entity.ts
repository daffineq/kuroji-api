
import {ApiProperty} from '@nestjs/swagger'
import {Anilist} from '../../anilist/entities/anilist.entity.js'


export class AnilistStreamingEpisode {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
})
anilistId: number ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
title: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
thumbnail: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
url: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
site: string  | null;
@ApiProperty({
  type: () => Object,
  required: false,
})
anilist?: Anilist ;
}
