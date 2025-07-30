
import {ApiProperty} from '@nestjs/swagger'
import {AniZip} from '../../aniZip/entities/aniZip.entity.js'


export class AniZipImage {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
coverType: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
url: string  | null;
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
