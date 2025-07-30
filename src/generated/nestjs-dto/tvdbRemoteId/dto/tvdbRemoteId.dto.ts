
import {ApiProperty} from '@nestjs/swagger'


export class TvdbRemoteIdDto {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
type: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
sourceName: string  | null;
}
