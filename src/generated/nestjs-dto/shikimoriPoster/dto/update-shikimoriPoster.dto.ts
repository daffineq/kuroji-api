
import {ApiProperty} from '@nestjs/swagger'




export class UpdateShikimoriPosterDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
originalUrl?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
mainUrl?: string  | null;
}
