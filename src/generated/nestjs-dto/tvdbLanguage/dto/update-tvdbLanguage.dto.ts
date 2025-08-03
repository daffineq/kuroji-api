
import {ApiProperty} from '@nestjs/swagger'




export class UpdateTvdbLanguageDto {
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
nativeName?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
shortCode?: string  | null;
}
