
import {ApiProperty} from '@nestjs/swagger'




export class UpdateTvdbAliasDto {
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
language?: string  | null;
}
