
import {ApiProperty} from '@nestjs/swagger'




export class UpdateShikimoriVideoDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
url?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
name?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
kind?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
playerUrl?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
imageUrl?: string  | null;
}
