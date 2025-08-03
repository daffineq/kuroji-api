
import {ApiProperty} from '@nestjs/swagger'


export class TvdbLoginDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'string',
})
token: string ;
@ApiProperty({
  type: 'string',
  format: 'date-time',
})
createDate: Date ;
@ApiProperty({
  type: 'boolean',
})
expired: boolean ;
}
