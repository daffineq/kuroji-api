
import {ApiProperty} from '@nestjs/swagger'




export class UpdateKitsuTitleDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
en?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
en_jp?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
ja_jp?: string  | null;
}
