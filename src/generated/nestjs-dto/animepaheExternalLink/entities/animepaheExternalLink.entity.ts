
import {ApiProperty} from '@nestjs/swagger'
import {Animepahe} from '../../animepahe/entities/animepahe.entity'


export class AnimepaheExternalLink {
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
@ApiProperty({
  type: () => Animepahe,
  isArray: true,
  required: false,
})
animepahe?: Animepahe[] ;
}
