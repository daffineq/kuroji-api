
import {ApiProperty} from '@nestjs/swagger'
import {Anilist} from '../../anilist/entities/anilist.entity.js'


export class StartDate {
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
day: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
month: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
year: number  | null;
@ApiProperty({
  type: () => Object,
  required: false,
})
anilist?: Anilist ;
}
