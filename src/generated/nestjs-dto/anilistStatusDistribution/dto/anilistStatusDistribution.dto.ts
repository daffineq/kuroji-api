
import {ApiProperty} from '@nestjs/swagger'


export class AnilistStatusDistributionDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'string',
})
status: string ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
})
amount: number ;
}
