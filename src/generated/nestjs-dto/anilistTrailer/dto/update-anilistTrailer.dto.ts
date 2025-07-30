
import {ApiProperty} from '@nestjs/swagger'




export class UpdateAnilistTrailerDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
site?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
thumbnail?: string  | null;
}
