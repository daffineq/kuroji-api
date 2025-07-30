
import {ApiProperty} from '@nestjs/swagger'




export class ConnectKitsuAnimeProductionsDto {
  @ApiProperty({
  type: 'string',
  required: false,
})
id?: string ;
@ApiProperty({
  type: 'string',
  required: false,
})
kitsuId?: string ;
}
