
import {ApiProperty} from '@nestjs/swagger'
import {AniZipTitle} from '../../aniZipTitle/entities/aniZipTitle.entity.js'
import {AniZipImage} from '../../aniZipImage/entities/aniZipImage.entity.js'
import {AniZipEpisode} from '../../aniZipEpisode/entities/aniZipEpisode.entity.js'
import {AniZipMapping} from '../../aniZipMapping/entities/aniZipMapping.entity.js'
import {Anilist} from '../../anilist/entities/anilist.entity.js'


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
  type: () => Object,
  isArray: true,
  required: false,
})
titles?: AniZipTitle[] ;
@ApiProperty({
  type: () => Object,
  isArray: true,
  required: false,
})
images?: AniZipImage[] ;
@ApiProperty({
  type: () => Object,
  isArray: true,
  required: false,
})
episodes?: AniZipEpisode[] ;
@ApiProperty({
  type: () => Object,
  required: false,
  nullable: true,
})
mappings?: AniZipMapping  | null;
@ApiProperty({
  type: () => Object,
  required: false,
  nullable: true,
})
anilist?: Anilist  | null;
}
