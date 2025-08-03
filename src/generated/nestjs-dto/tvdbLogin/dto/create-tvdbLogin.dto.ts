
import {ApiProperty} from '@nestjs/swagger'




export class CreateTvdbLoginDto {
  @ApiProperty({
  type: 'string',
})
token: string ;
}
