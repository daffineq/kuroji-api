
import {ApiProperty} from '@nestjs/swagger'


export class AnilistScoreDistributionDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
})
score: number ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
})
amount: number ;
}
