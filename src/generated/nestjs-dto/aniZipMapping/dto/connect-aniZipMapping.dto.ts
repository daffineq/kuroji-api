
import {ApiProperty} from '@nestjs/swagger'




export class ConnectAniZipMappingDto {
  @ApiProperty({
  type: 'string',
  required: false,
})
id?: string ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
})
aniZipId?: number ;
}
