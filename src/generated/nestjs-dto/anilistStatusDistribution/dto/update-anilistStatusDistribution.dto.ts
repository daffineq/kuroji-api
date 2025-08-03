
import {ApiProperty} from '@nestjs/swagger'




export class UpdateAnilistStatusDistributionDto {
  @ApiProperty({
  type: 'string',
  required: false,
})
status?: string ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
})
amount?: number ;
}
