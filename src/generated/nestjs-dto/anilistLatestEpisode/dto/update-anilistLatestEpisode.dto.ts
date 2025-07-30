
import {ApiProperty} from '@nestjs/swagger'




export class UpdateAnilistLatestEpisodeDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
episode?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
airingAt?: number  | null;
}
