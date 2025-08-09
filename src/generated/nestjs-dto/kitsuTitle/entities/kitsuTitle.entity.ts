
import {ApiProperty} from '@nestjs/swagger'
import {Kitsu} from '../../kitsu/entities/kitsu.entity'


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
  type: () => Kitsu,
  required: false,
})
kitsu?: Kitsu ;
}
