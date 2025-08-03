
import {ApiProperty} from '@nestjs/swagger'
import {AniZipEpisode} from '../../aniZipEpisode/entities/aniZipEpisode.entity.js'


export class AniZipEpisodeTitle {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'string',
})
key: string ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
name: string  | null;
@ApiProperty({
  type: 'string',
})
episodeId: string ;
@ApiProperty({
  type: () => Object,
  required: false,
})
episode?: AniZipEpisode ;
}
