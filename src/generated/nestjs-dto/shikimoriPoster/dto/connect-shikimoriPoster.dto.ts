
import {ApiProperty} from '@nestjs/swagger'




export class ConnectShikimoriPosterDto {
  @ApiProperty({
  type: 'string',
  required: false,
})
id?: string ;
@ApiProperty({
  type: 'string',
  required: false,
})
shikimoriId?: string ;
}
