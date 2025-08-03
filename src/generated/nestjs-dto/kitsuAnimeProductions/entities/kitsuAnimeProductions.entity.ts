
import {ApiProperty} from '@nestjs/swagger'
import {Kitsu} from '../../kitsu/entities/kitsu.entity.js'


export class KitsuAnimeProductions {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'string',
})
selfLink: string ;
@ApiProperty({
  type: 'string',
})
related: string ;
@ApiProperty({
  type: 'string',
})
kitsuId: string ;
@ApiProperty({
  type: () => Object,
  required: false,
})
kitsu?: Kitsu ;
}
