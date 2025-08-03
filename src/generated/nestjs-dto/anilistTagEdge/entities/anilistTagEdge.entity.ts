
import {ApiProperty} from '@nestjs/swagger'
import {Anilist} from '../../anilist/entities/anilist.entity.js'
import {AnilistTag} from '../../anilistTag/entities/anilistTag.entity.js'


export class AnilistTagEdge {
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
tagId: number ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
rank: number  | null;
@ApiProperty({
  type: 'boolean',
  nullable: true,
})
isMediaSpoiler: boolean  | null;
@ApiProperty({
  type: () => Object,
  required: false,
})
anilist?: Anilist ;
@ApiProperty({
  type: () => Object,
  required: false,
})
tag?: AnilistTag ;
}
