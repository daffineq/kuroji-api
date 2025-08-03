
import {ApiProperty} from '@nestjs/swagger'




export class UpdateAnilistTagDto {
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
description?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
category?: string  | null;
@ApiProperty({
  type: 'boolean',
  required: false,
  nullable: true,
})
isGeneralSpoiler?: boolean  | null;
@ApiProperty({
  type: 'boolean',
  required: false,
  nullable: true,
})
isAdult?: boolean  | null;
}
