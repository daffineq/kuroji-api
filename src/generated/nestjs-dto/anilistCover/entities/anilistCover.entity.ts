
import {ApiProperty} from '@nestjs/swagger'
import {Anilist} from '../../anilist/entities/anilist.entity'


export class AnilistCover {
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
color: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
large: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
medium: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
extraLarge: string  | null;
@ApiProperty({
  type: () => Anilist,
  required: false,
})
anilist?: Anilist ;
}
