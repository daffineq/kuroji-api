
import {ApiProperty} from '@nestjs/swagger'




export class UpdateAnilistCharacterImageDto {
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
