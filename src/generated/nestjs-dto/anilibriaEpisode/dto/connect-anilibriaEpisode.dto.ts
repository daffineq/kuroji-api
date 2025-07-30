
import {ApiProperty} from '@nestjs/swagger'




export class ConnectAnilibriaEpisodeDto {
  @ApiProperty({
  type: 'string',
})
id: string ;
}
