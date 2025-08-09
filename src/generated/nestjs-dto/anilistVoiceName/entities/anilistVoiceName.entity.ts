
import {ApiProperty} from '@nestjs/swagger'
import {VoiceActor} from '../../voiceActor/entities/voiceActor.entity'


export class AnilistVoiceName {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
full: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
native: string  | null;
@ApiProperty({
  type: 'string',
  isArray: true,
})
alternative: string[] ;
@ApiProperty({
  type: () => VoiceActor,
  required: false,
  nullable: true,
})
voiceActor?: VoiceActor  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
voiceActorId: number  | null;
}
