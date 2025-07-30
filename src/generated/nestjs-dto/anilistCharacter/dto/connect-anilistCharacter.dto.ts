
import {ApiProperty} from '@nestjs/swagger'




export class ConnectAnilistCharacterDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
}
