
import {ApiProperty} from '@nestjs/swagger'
import {AniZipTitle} from '../../aniZipTitle/entities/aniZipTitle.entity'
import {AniZipImage} from '../../aniZipImage/entities/aniZipImage.entity'
import {AniZipEpisode} from '../../aniZipEpisode/entities/aniZipEpisode.entity'
import {AniZipMapping} from '../../aniZipMapping/entities/aniZipMapping.entity'
import {Anilist} from '../../anilist/entities/anilist.entity'


export class AniZip {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
id: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
})
episodeCount: number ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
})
specialCount: number ;
@ApiProperty({
  type: () => AniZipTitle,
  isArray: true,
  required: false,
})
titles?: AniZipTitle[] ;
@ApiProperty({
  type: () => AniZipImage,
  isArray: true,
  required: false,
})
images?: AniZipImage[] ;
@ApiProperty({
  type: () => AniZipEpisode,
  isArray: true,
  required: false,
})
episodes?: AniZipEpisode[] ;
@ApiProperty({
  type: () => AniZipMapping,
  required: false,
  nullable: true,
})
mappings?: AniZipMapping  | null;
@ApiProperty({
  type: () => Anilist,
  required: false,
  nullable: true,
})
anilist?: Anilist  | null;
}
