
import {ApiProperty} from '@nestjs/swagger'


export class TvdbStatusDto {
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
recordType: string  | null;
@ApiProperty({
  type: 'boolean',
  nullable: true,
})
keepUpdated: boolean  | null;
}
