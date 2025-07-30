
import {ApiProperty} from '@nestjs/swagger'


export class AnimepaheExternalLinkDto {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'string',
})
url: string ;
@ApiProperty({
  type: 'string',
})
sourceName: string ;
}
