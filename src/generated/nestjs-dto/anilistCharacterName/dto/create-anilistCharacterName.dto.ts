
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectAnilistCharacterDto} from '../../anilistCharacter/dto/connect-anilistCharacter.dto'

export class CreateAnilistCharacterNameCharacterRelationInputDto {
    @ApiProperty({
  type: ConnectAnilistCharacterDto,
})
connect: ConnectAnilistCharacterDto ;
  }

@ApiExtraModels(ConnectAnilistCharacterDto,CreateAnilistCharacterNameCharacterRelationInputDto)
export class CreateAnilistCharacterNameDto {
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
  type: CreateAnilistCharacterNameCharacterRelationInputDto,
})
character?: CreateAnilistCharacterNameCharacterRelationInputDto ;
}
