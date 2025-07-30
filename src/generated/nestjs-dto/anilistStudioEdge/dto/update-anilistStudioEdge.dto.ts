
import {ApiProperty} from '@nestjs/swagger'




export class UpdateAnilistStudioEdgeDto {
  @ApiProperty({
  type: 'boolean',
  required: false,
  nullable: true,
})
isMain?: boolean  | null;
}
