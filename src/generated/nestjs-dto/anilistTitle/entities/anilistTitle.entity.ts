
import {ApiProperty} from '@nestjs/swagger'
import {Anilist} from '../../anilist/entities/anilist.entity.js'


export class AnilistTitle {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
})
anilistId: number ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
romaji: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
english: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
native: string  | null;
@ApiProperty({
  type: () => Object,
  required: false,
})
anilist?: Anilist ;
}
