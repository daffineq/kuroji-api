
import {ApiProperty} from '@nestjs/swagger'




export class UpdateAnilistTagEdgeDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
rank?: number  | null;
@ApiProperty({
  type: 'boolean',
  required: false,
  nullable: true,
})
isMediaSpoiler?: boolean  | null;
}
