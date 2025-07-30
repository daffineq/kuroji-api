
import {ApiProperty} from '@nestjs/swagger'
import {Kitsu} from '../../kitsu/entities/kitsu.entity.js'


export class KitsuTitle {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
en: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
en_jp: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
ja_jp: string  | null;
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
