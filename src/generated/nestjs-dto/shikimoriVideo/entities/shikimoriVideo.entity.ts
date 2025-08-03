
import {ApiProperty} from '@nestjs/swagger'
import {Shikimori} from '../../shikimori/entities/shikimori.entity.js'


export class ShikimoriVideo {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
url: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
name: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
kind: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
playerUrl: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
imageUrl: string  | null;
@ApiProperty({
  type: () => Object,
  isArray: true,
  required: false,
})
shikimori?: Shikimori[] ;
}
