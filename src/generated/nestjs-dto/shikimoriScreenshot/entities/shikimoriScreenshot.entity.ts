
import {ApiProperty} from '@nestjs/swagger'
import {Shikimori} from '../../shikimori/entities/shikimori.entity.js'


export class ShikimoriScreenshot {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
originalUrl: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
x166Url: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
x332Url: string  | null;
@ApiProperty({
  type: () => Object,
  isArray: true,
  required: false,
})
shikimori?: Shikimori[] ;
}
