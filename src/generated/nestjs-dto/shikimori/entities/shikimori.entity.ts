
import {ApiProperty} from '@nestjs/swagger'
import {ShikimoriPoster} from '../../shikimoriPoster/entities/shikimoriPoster.entity.js'
import {AiredOn} from '../../airedOn/entities/airedOn.entity.js'
import {ReleasedOn} from '../../releasedOn/entities/releasedOn.entity.js'
import {BasicIdShik} from '../../basicIdShik/entities/basicIdShik.entity.js'
import {ShikimoriVideo} from '../../shikimoriVideo/entities/shikimoriVideo.entity.js'
import {ShikimoriScreenshot} from '../../shikimoriScreenshot/entities/shikimoriScreenshot.entity.js'
import {Anilist} from '../../anilist/entities/anilist.entity.js'


export class Shikimori {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
malId: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
name: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
russian: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
licenseNameRu: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
english: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
japanese: string  | null;
@ApiProperty({
  type: () => Object,
  required: false,
  nullable: true,
})
poster?: ShikimoriPoster  | null;
@ApiProperty({
  type: 'string',
  isArray: true,
})
synonyms: string[] ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
kind: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
rating: string  | null;
@ApiProperty({
  type: 'number',
  format: 'float',
  nullable: true,
})
score: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
status: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
episodes: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
episodesAired: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
duration: number  | null;
@ApiProperty({
  type: () => Object,
  required: false,
  nullable: true,
})
airedOn?: AiredOn  | null;
@ApiProperty({
  type: () => Object,
  required: false,
  nullable: true,
})
releasedOn?: ReleasedOn  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
franchise: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
url: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
season: string  | null;
@ApiProperty({
  type: 'string',
  format: 'date-time',
  nullable: true,
})
createdAt: Date  | null;
@ApiProperty({
  type: 'string',
  format: 'date-time',
  nullable: true,
})
updatedAt: Date  | null;
@ApiProperty({
  type: 'string',
  format: 'date-time',
  nullable: true,
})
nextEpisodeAt: Date  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
description: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
descriptionHtml: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
descriptionSource: string  | null;
@ApiProperty({
  type: () => Object,
  isArray: true,
  required: false,
})
chronology?: BasicIdShik[] ;
@ApiProperty({
  type: () => Object,
  isArray: true,
  required: false,
})
videos?: ShikimoriVideo[] ;
@ApiProperty({
  type: () => Object,
  isArray: true,
  required: false,
})
screenshots?: ShikimoriScreenshot[] ;
@ApiProperty({
  type: () => Object,
  required: false,
  nullable: true,
})
anilist?: Anilist  | null;
}
