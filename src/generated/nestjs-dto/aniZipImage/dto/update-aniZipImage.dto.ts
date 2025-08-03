
import {ApiProperty} from '@nestjs/swagger'




export class UpdateAniZipImageDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
coverType?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
url?: string  | null;
}
