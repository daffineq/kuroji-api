
import {ApiProperty} from '@nestjs/swagger'
import {AniZip} from '../../aniZip/entities/aniZip.entity.js'


export class AniZipTitle {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'string',
})
key: string ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
name: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
})
aniZipId: number ;
@ApiProperty({
  type: () => Object,
  required: false,
})
aniZip?: AniZip ;
}
