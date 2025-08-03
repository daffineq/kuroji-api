
import {ApiProperty} from '@nestjs/swagger'


export class AnilistTrailerDto {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
site: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
thumbnail: string  | null;
}
