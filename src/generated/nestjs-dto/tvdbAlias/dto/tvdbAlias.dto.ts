
import {ApiProperty} from '@nestjs/swagger'


export class TvdbAliasDto {
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
language: string  | null;
}
