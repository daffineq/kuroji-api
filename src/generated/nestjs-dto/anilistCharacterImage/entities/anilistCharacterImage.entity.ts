
import {ApiProperty} from '@nestjs/swagger'
import {AnilistCharacter} from '../../anilistCharacter/entities/anilistCharacter.entity.js'


export class AnilistCharacterImage {
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
character?: AnilistCharacter  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
characterId: number  | null;
}
