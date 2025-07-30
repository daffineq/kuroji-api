
import {ApiProperty} from '@nestjs/swagger'
import {Anilist} from '../../anilist/entities/anilist.entity.js'


export class AnilistRanking {
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
  type: 'integer',
  format: 'int32',
  nullable: true,
})
rank: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
type: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
format: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
year: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
season: string  | null;
@ApiProperty({
  type: 'boolean',
  nullable: true,
})
allTime: boolean  | null;
@ApiProperty({
  type: 'string',
})
context: string ;
@ApiProperty({
  type: () => Object,
  required: false,
})
anilist?: Anilist ;
}
