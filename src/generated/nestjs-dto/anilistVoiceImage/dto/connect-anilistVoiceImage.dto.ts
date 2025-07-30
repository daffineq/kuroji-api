
import {ApiProperty} from '@nestjs/swagger'




export class ConnectAnilistVoiceImageDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
})
id?: number ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
})
voiceActorId?: number ;
}
