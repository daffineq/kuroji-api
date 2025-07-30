
import {ApiProperty} from '@nestjs/swagger'
import {AnilistCharacterName} from '../../anilistCharacterName/entities/anilistCharacterName.entity.js'
import {AnilistCharacterImage} from '../../anilistCharacterImage/entities/anilistCharacterImage.entity.js'
import {AnilistCharacterEdge} from '../../anilistCharacterEdge/entities/anilistCharacterEdge.entity.js'


export class AnilistCharacter {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: () => Object,
  required: false,
  nullable: true,
})
name?: AnilistCharacterName  | null;
@ApiProperty({
  type: () => Object,
  required: false,
  nullable: true,
})
image?: AnilistCharacterImage  | null;
@ApiProperty({
  type: () => Object,
  isArray: true,
  required: false,
})
animeLinks?: AnilistCharacterEdge[] ;
}
