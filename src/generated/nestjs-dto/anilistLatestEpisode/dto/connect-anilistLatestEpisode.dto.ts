
import {ApiProperty} from '@nestjs/swagger'




export class ConnectAnilistLatestEpisodeDto {
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
anilistId?: number ;
}
