
import {ApiProperty} from '@nestjs/swagger'




export class ConnectAnilibriaDto {
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
anilist_id?: number ;
@ApiProperty({
  type: 'string',
  required: false,
})
alias?: string ;
}
