
import {ApiProperty} from '@nestjs/swagger'


export class KitsuAnimeCharactersDto {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'string',
})
selfLink: string ;
@ApiProperty({
  type: 'string',
})
related: string ;
}
