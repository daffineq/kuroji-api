
import {ApiProperty} from '@nestjs/swagger'
import {Anilist} from '../../anilist/entities/anilist.entity.js'
import {AnilistCharacter} from '../../anilistCharacter/entities/anilistCharacter.entity.js'
import {VoiceActor} from '../../voiceActor/entities/voiceActor.entity.js'


export class AnilistCharacterEdge {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
})
anilistId: number ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
})
characterId: number ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
role: string  | null;
@ApiProperty({
  type: () => Object,
  required: false,
})
anilist?: Anilist ;
@ApiProperty({
  type: () => Object,
  required: false,
})
character?: AnilistCharacter ;
@ApiProperty({
  type: () => Object,
  isArray: true,
  required: false,
})
voiceActors?: VoiceActor[] ;
}
