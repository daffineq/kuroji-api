
import {ApiProperty} from '@nestjs/swagger'




export class UpdateTvdbStatusDto {
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
recordType?: string  | null;
@ApiProperty({
  type: 'boolean',
  required: false,
  nullable: true,
})
keepUpdated?: boolean  | null;
}
