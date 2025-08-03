
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectVoiceActorDto} from '../../voiceActor/dto/connect-voiceActor.dto.js'

export class CreateAnilistVoiceNameVoiceActorRelationInputDto {
    @ApiProperty({
  type: ConnectVoiceActorDto,
})
connect: ConnectVoiceActorDto ;
  }

@ApiExtraModels(ConnectVoiceActorDto,CreateAnilistVoiceNameVoiceActorRelationInputDto)
export class CreateAnilistVoiceNameDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
full?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
native?: string  | null;
@ApiProperty({
  type: 'string',
  isArray: true,
})
alternative: string[] ;
@ApiProperty({
  required: false,
  type: CreateAnilistVoiceNameVoiceActorRelationInputDto,
})
voiceActor?: CreateAnilistVoiceNameVoiceActorRelationInputDto ;
}
