
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectVoiceActorDto} from '../../voiceActor/dto/connect-voiceActor.dto.js'

export class CreateAnilistVoiceImageVoiceActorRelationInputDto {
    @ApiProperty({
  type: ConnectVoiceActorDto,
})
connect: ConnectVoiceActorDto ;
  }

@ApiExtraModels(ConnectVoiceActorDto,CreateAnilistVoiceImageVoiceActorRelationInputDto)
export class CreateAnilistVoiceImageDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
large?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
medium?: string  | null;
@ApiProperty({
  required: false,
  type: CreateAnilistVoiceImageVoiceActorRelationInputDto,
})
voiceActor?: CreateAnilistVoiceImageVoiceActorRelationInputDto ;
}
