
import {ApiProperty} from '@nestjs/swagger'
import {Anilist} from '../../anilist/entities/anilist.entity.js'


export class AnilistScoreDistribution {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
})
score: number ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
})
amount: number ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
})
anilistId: number ;
@ApiProperty({
  type: () => Object,
  required: false,
})
anilist?: Anilist ;
}
