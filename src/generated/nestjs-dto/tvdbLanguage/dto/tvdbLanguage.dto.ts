
import {ApiProperty} from '@nestjs/swagger'


export class TvdbLanguageDto {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
name: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
nativeName: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
shortCode: string  | null;
}
