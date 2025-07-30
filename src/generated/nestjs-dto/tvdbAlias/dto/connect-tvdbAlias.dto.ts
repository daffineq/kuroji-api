
import {ApiProperty} from '@nestjs/swagger'




export class ConnectTvdbAliasDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
}
