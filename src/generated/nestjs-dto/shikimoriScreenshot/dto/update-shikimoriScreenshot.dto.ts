
import {ApiProperty} from '@nestjs/swagger'




export class UpdateShikimoriScreenshotDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
originalUrl?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
x166Url?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
x332Url?: string  | null;
}
