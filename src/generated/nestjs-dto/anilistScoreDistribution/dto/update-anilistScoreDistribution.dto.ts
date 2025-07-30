
import {ApiProperty} from '@nestjs/swagger'




export class UpdateAnilistScoreDistributionDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
})
score?: number ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
})
amount?: number ;
}
