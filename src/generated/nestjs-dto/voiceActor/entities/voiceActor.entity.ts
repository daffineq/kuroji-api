
import {ApiProperty} from '@nestjs/swagger'
import {AnilistVoiceName} from '../../anilistVoiceName/entities/anilistVoiceName.entity'
import {AnilistVoiceImage} from '../../anilistVoiceImage/entities/anilistVoiceImage.entity'
import {AnilistCharacterEdge} from '../../anilistCharacterEdge/entities/anilistCharacterEdge.entity'


export class VoiceActor {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
language: string  | null;
@ApiProperty({
  type: () => AnilistVoiceName,
  required: false,
  nullable: true,
})
name?: AnilistVoiceName  | null;
@ApiProperty({
  type: () => AnilistVoiceImage,
  required: false,
  nullable: true,
})
image?: AnilistVoiceImage  | null;
@ApiProperty({
  type: () => AnilistCharacterEdge,
  isArray: true,
  required: false,
})
characters?: AnilistCharacterEdge[] ;
}
