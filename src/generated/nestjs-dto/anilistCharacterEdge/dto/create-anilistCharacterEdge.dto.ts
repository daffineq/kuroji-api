
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectAnilistDto} from '../../anilist/dto/connect-anilist.dto.js'
import {ConnectAnilistCharacterDto} from '../../anilistCharacter/dto/connect-anilistCharacter.dto.js'
import {CreateVoiceActorDto} from '../../voiceActor/dto/create-voiceActor.dto.js'
import {ConnectVoiceActorDto} from '../../voiceActor/dto/connect-voiceActor.dto.js'

export class CreateAnilistCharacterEdgeAnilistRelationInputDto {
    @ApiProperty({
  type: ConnectAnilistDto,
})
connect: ConnectAnilistDto ;
  }
export class CreateAnilistCharacterEdgeCharacterRelationInputDto {
    @ApiProperty({
  type: ConnectAnilistCharacterDto,
})
connect: ConnectAnilistCharacterDto ;
  }
export class CreateAnilistCharacterEdgeVoiceActorsRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateVoiceActorDto,
  isArray: true,
})
create?: CreateVoiceActorDto[] ;
@ApiProperty({
  required: false,
  type: ConnectVoiceActorDto,
  isArray: true,
})
connect?: ConnectVoiceActorDto[] ;
  }

@ApiExtraModels(ConnectAnilistDto,CreateAnilistCharacterEdgeAnilistRelationInputDto,ConnectAnilistCharacterDto,CreateAnilistCharacterEdgeCharacterRelationInputDto,CreateVoiceActorDto,ConnectVoiceActorDto,CreateAnilistCharacterEdgeVoiceActorsRelationInputDto)
export class CreateAnilistCharacterEdgeDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
role?: string  | null;
@ApiProperty({
  type: CreateAnilistCharacterEdgeAnilistRelationInputDto,
})
anilist: CreateAnilistCharacterEdgeAnilistRelationInputDto ;
@ApiProperty({
  type: CreateAnilistCharacterEdgeCharacterRelationInputDto,
})
character: CreateAnilistCharacterEdgeCharacterRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateAnilistCharacterEdgeVoiceActorsRelationInputDto,
})
voiceActors?: CreateAnilistCharacterEdgeVoiceActorsRelationInputDto ;
}
