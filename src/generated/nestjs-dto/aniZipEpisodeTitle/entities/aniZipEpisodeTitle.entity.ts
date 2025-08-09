
import {ApiProperty} from '@nestjs/swagger'
import {AniZipEpisode} from '../../aniZipEpisode/entities/aniZipEpisode.entity'


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
  type: () => AniZipEpisode,
  required: false,
})
episode?: AniZipEpisode ;
}
