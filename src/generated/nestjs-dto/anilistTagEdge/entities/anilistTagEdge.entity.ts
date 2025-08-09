
import {ApiProperty} from '@nestjs/swagger'
import {Anilist} from '../../anilist/entities/anilist.entity'
import {AnilistTag} from '../../anilistTag/entities/anilistTag.entity'


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
  type: () => Anilist,
  required: false,
})
anilist?: Anilist ;
@ApiProperty({
  type: () => AnilistTag,
  required: false,
})
tag?: AnilistTag ;
}
