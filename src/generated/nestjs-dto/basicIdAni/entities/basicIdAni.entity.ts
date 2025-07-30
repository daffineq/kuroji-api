
import {ApiProperty} from '@nestjs/swagger'
import {Anilist} from '../../anilist/entities/anilist.entity.js'


export class BasicIdAni {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
idMal: number  | null;
@ApiProperty({
  type: () => Object,
  isArray: true,
  required: false,
})
Anilist?: Anilist[] ;
}
