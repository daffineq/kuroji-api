
import {ApiProperty} from '@nestjs/swagger'




export class UpdateAnimepaheExternalLinkDto {
  @ApiProperty({
  type: 'string',
  required: false,
})
url?: string ;
@ApiProperty({
  type: 'string',
  required: false,
})
sourceName?: string ;
}
