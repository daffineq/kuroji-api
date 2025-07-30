
import {ApiProperty} from '@nestjs/swagger'




export class UpdateAnilistVoiceImageDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
large?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
medium?: string  | null;
}
