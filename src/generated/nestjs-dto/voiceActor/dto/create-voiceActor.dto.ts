
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectAnilistVoiceNameDto} from '../../anilistVoiceName/dto/connect-anilistVoiceName.dto'
import {ConnectAnilistVoiceImageDto} from '../../anilistVoiceImage/dto/connect-anilistVoiceImage.dto'
import {CreateAnilistCharacterEdgeDto} from '../../anilistCharacterEdge/dto/create-anilistCharacterEdge.dto'
import {ConnectAnilistCharacterEdgeDto} from '../../anilistCharacterEdge/dto/connect-anilistCharacterEdge.dto'

export class CreateVoiceActorNameRelationInputDto {
    @ApiProperty({
  type: ConnectAnilistVoiceNameDto,
})
connect: ConnectAnilistVoiceNameDto ;
  }
export class CreateVoiceActorImageRelationInputDto {
    @ApiProperty({
  type: ConnectAnilistVoiceImageDto,
})
connect: ConnectAnilistVoiceImageDto ;
  }
export class CreateVoiceActorCharactersRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateAnilistCharacterEdgeDto,
  isArray: true,
})
create?: CreateAnilistCharacterEdgeDto[] ;
@ApiProperty({
  required: false,
  type: ConnectAnilistCharacterEdgeDto,
  isArray: true,
})
connect?: ConnectAnilistCharacterEdgeDto[] ;
  }

@ApiExtraModels(ConnectAnilistVoiceNameDto,CreateVoiceActorNameRelationInputDto,ConnectAnilistVoiceImageDto,CreateVoiceActorImageRelationInputDto,CreateAnilistCharacterEdgeDto,ConnectAnilistCharacterEdgeDto,CreateVoiceActorCharactersRelationInputDto)
export class CreateVoiceActorDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
language?: string  | null;
@ApiProperty({
  required: false,
  type: CreateVoiceActorNameRelationInputDto,
})
name?: CreateVoiceActorNameRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateVoiceActorImageRelationInputDto,
})
image?: CreateVoiceActorImageRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateVoiceActorCharactersRelationInputDto,
})
characters?: CreateVoiceActorCharactersRelationInputDto ;
}
