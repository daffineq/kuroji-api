
import {ApiProperty} from '@nestjs/swagger'


export class ShikimoriPosterDto {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
originalUrl: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
mainUrl: string  | null;
}
