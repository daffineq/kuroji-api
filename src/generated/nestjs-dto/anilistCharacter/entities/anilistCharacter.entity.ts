
import {ApiProperty} from '@nestjs/swagger'
import {AnilistCharacterName} from '../../anilistCharacterName/entities/anilistCharacterName.entity'
import {AnilistCharacterImage} from '../../anilistCharacterImage/entities/anilistCharacterImage.entity'
import {AnilistCharacterEdge} from '../../anilistCharacterEdge/entities/anilistCharacterEdge.entity'


export class AnilistCharacter {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: () => AnilistCharacterName,
  required: false,
  nullable: true,
})
name?: AnilistCharacterName  | null;
@ApiProperty({
  type: () => AnilistCharacterImage,
  required: false,
  nullable: true,
})
image?: AnilistCharacterImage  | null;
@ApiProperty({
  type: () => AnilistCharacterEdge,
  isArray: true,
  required: false,
})
animeLinks?: AnilistCharacterEdge[] ;
}
