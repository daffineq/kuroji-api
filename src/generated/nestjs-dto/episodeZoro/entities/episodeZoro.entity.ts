
import {ApiProperty} from '@nestjs/swagger'
import {Zoro} from '../../zoro/entities/zoro.entity'


export class EpisodeZoro {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
number: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
title: string  | null;
@ApiProperty({
  type: 'boolean',
  nullable: true,
})
isFiller: boolean  | null;
@ApiProperty({
  type: 'boolean',
  nullable: true,
})
isSubbed: boolean  | null;
@ApiProperty({
  type: 'boolean',
  nullable: true,
})
isDubbed: boolean  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
url: string  | null;
@ApiProperty({
  type: () => Zoro,
  isArray: true,
  required: false,
})
zoro?: Zoro[] ;
}
