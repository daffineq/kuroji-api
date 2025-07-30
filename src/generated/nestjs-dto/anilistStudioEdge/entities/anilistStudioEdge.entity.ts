
import {ApiProperty} from '@nestjs/swagger'
import {Anilist} from '../../anilist/entities/anilist.entity.js'
import {AnilistStudio} from '../../anilistStudio/entities/anilistStudio.entity.js'


export class AnilistStudioEdge {
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
  type: 'integer',
  format: 'int32',
})
studioId: number ;
@ApiProperty({
  type: 'boolean',
  nullable: true,
})
isMain: boolean  | null;
@ApiProperty({
  type: () => Object,
  required: false,
})
anilist?: Anilist ;
@ApiProperty({
  type: () => Object,
  required: false,
})
studio?: AnilistStudio ;
}
