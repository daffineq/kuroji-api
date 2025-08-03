
import {ApiProperty} from '@nestjs/swagger'
import {Shikimori} from '../../shikimori/entities/shikimori.entity.js'


export class BasicIdShik {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
malId: string  | null;
@ApiProperty({
  type: () => Object,
  isArray: true,
  required: false,
})
shikimori?: Shikimori[] ;
}
