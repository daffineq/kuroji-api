
import {ApiProperty} from '@nestjs/swagger'




export class UpdateTvdbLoginDto {
  @ApiProperty({
  type: 'string',
  required: false,
})
token?: string ;
}
