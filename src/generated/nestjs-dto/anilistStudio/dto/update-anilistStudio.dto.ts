
import {ApiProperty} from '@nestjs/swagger'




export class UpdateAnilistStudioDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
name?: string  | null;
}
