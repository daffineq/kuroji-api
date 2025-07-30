
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectAnilistCharacterDto} from '../../anilistCharacter/dto/connect-anilistCharacter.dto.js'

export class CreateAnilistCharacterImageCharacterRelationInputDto {
    @ApiProperty({
  type: ConnectAnilistCharacterDto,
})
connect: ConnectAnilistCharacterDto ;
  }

@ApiExtraModels(ConnectAnilistCharacterDto,CreateAnilistCharacterImageCharacterRelationInputDto)
export class CreateAnilistCharacterImageDto {
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
  type: CreateAnilistCharacterImageCharacterRelationInputDto,
})
character?: CreateAnilistCharacterImageCharacterRelationInputDto ;
}
