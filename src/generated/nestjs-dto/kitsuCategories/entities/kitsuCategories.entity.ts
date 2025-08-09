
import {ApiProperty} from '@nestjs/swagger'
import {Kitsu} from '../../kitsu/entities/kitsu.entity'


export class KitsuCategories {
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
  type: () => Kitsu,
  required: false,
})
kitsu?: Kitsu ;
}
