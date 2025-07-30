
import {ApiProperty} from '@nestjs/swagger'




export class UpdateAnilistRankingDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
rank?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
type?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
format?: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
year?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
season?: string  | null;
@ApiProperty({
  type: 'boolean',
  required: false,
  nullable: true,
})
allTime?: boolean  | null;
@ApiProperty({
  type: 'string',
  required: false,
})
context?: string ;
}
