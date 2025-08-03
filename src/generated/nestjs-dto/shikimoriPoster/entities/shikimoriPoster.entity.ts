
import {ApiProperty} from '@nestjs/swagger'
import {Shikimori} from '../../shikimori/entities/shikimori.entity.js'


export class ShikimoriPoster {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'string',
})
shikimoriId: string ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
originalUrl: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
mainUrl: string  | null;
@ApiProperty({
  type: () => Object,
  required: false,
})
shikimori?: Shikimori ;
}
