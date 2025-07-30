
import {ApiProperty} from '@nestjs/swagger'




export class UpdateAnilistCharacterEdgeDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
role?: string  | null;
}
