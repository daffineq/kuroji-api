
import {ApiProperty} from '@nestjs/swagger'




export class UpdateTitleDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
romaji?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
english?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
native?: string  | null;
}
