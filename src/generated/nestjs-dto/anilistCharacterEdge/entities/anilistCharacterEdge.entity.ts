
import {ApiProperty} from '@nestjs/swagger'
import {Anilist} from '../../anilist/entities/anilist.entity'
import {AnilistCharacter} from '../../anilistCharacter/entities/anilistCharacter.entity'
import {VoiceActor} from '../../voiceActor/entities/voiceActor.entity'


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
  type: () => Anilist,
  required: false,
})
anilist?: Anilist ;
@ApiProperty({
  type: () => AnilistCharacter,
  required: false,
})
character?: AnilistCharacter ;
@ApiProperty({
  type: () => VoiceActor,
  isArray: true,
  required: false,
})
voiceActors?: VoiceActor[] ;
}
