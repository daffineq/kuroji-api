
import {ApiProperty} from '@nestjs/swagger'


export class ShikimoriScreenshotDto {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
originalUrl: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
x166Url: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
x332Url: string  | null;
}
