
import {ApiProperty} from '@nestjs/swagger'
import {Anilist} from '../../anilist/entities/anilist.entity'
import {AnilistStudio} from '../../anilistStudio/entities/anilistStudio.entity'


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
  type: () => Anilist,
  required: false,
})
anilist?: Anilist ;
@ApiProperty({
  type: () => AnilistStudio,
  required: false,
})
studio?: AnilistStudio ;
}
