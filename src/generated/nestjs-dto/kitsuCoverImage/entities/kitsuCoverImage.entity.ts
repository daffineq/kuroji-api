
import {ApiProperty} from '@nestjs/swagger'
import {KitsuImageDimensions} from '../../kitsuImageDimensions/entities/kitsuImageDimensions.entity'
import {Kitsu} from '../../kitsu/entities/kitsu.entity'


export class KitsuCoverImage {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
tiny: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
small: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
large: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
original: string  | null;
@ApiProperty({
  type: () => KitsuImageDimensions,
  required: false,
  nullable: true,
})
dimensions?: KitsuImageDimensions  | null;
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
