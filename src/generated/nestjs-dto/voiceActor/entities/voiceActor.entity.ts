
import {ApiProperty} from '@nestjs/swagger'
import {AnilistVoiceName} from '../../anilistVoiceName/entities/anilistVoiceName.entity.js'
import {AnilistVoiceImage} from '../../anilistVoiceImage/entities/anilistVoiceImage.entity.js'
import {AnilistCharacterEdge} from '../../anilistCharacterEdge/entities/anilistCharacterEdge.entity.js'


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
  type: () => Object,
  required: false,
  nullable: true,
})
name?: AnilistVoiceName  | null;
@ApiProperty({
  type: () => Object,
  required: false,
  nullable: true,
})
image?: AnilistVoiceImage  | null;
@ApiProperty({
  type: () => Object,
  isArray: true,
  required: false,
})
characters?: AnilistCharacterEdge[] ;
}
