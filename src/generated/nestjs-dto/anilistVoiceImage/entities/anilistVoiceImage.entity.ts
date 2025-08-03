
import {ApiProperty} from '@nestjs/swagger'
import {VoiceActor} from '../../voiceActor/entities/voiceActor.entity.js'


export class AnilistVoiceImage {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
large: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
medium: string  | null;
@ApiProperty({
  type: () => Object,
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
