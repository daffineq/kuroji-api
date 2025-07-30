
import {ApiProperty} from '@nestjs/swagger'




export class CreateTvdbRemoteIdDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
type?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
sourceName?: string  | null;
}
