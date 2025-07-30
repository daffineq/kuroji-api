
import {ApiProperty} from '@nestjs/swagger'




export class UpdateAnilistCoverDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
color?: string  | null;
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
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
extraLarge?: string  | null;
}
