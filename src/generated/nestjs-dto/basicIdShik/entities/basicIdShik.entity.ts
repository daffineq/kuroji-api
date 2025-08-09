
import {ApiProperty} from '@nestjs/swagger'
import {Shikimori} from '../../shikimori/entities/shikimori.entity'


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
  type: () => Shikimori,
  isArray: true,
  required: false,
})
shikimori?: Shikimori[] ;
}
