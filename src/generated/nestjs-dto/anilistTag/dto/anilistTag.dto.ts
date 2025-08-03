
import {ApiProperty} from '@nestjs/swagger'


export class AnilistTagDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
name: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
description: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
category: string  | null;
@ApiProperty({
  type: 'boolean',
  nullable: true,
})
isGeneralSpoiler: boolean  | null;
@ApiProperty({
  type: 'boolean',
  nullable: true,
})
isAdult: boolean  | null;
}
