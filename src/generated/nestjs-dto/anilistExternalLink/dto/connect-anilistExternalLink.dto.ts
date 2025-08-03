
import {ApiProperty} from '@nestjs/swagger'




export class ConnectAnilistExternalLinkDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
}
