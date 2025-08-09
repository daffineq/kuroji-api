
import {ApiProperty} from '@nestjs/swagger'
import {AniZipEpisodeTitle} from '../../aniZipEpisodeTitle/entities/aniZipEpisodeTitle.entity'
import {AniZip} from '../../aniZip/entities/aniZip.entity'


export class AniZipEpisode {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
episodeKey: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
episodeNumber: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
seasonNumber: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
absoluteEpisodeNumber: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
tvdbShowId: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
tvdbId: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
airDate: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
airDateUtc: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
runtime: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
length: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
overview: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
image: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
rating: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
episode: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
anidbEid: number  | null;
@ApiProperty({
  type: () => AniZipEpisodeTitle,
  isArray: true,
  required: false,
})
titles?: AniZipEpisodeTitle[] ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
})
aniZipId: number ;
@ApiProperty({
  type: () => AniZip,
  required: false,
})
aniZip?: AniZip ;
}
