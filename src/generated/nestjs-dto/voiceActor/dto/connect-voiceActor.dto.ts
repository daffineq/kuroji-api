
import {ApiProperty} from '@nestjs/swagger'




export class ConnectVoiceActorDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
}
