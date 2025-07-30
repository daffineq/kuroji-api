
import {ApiProperty} from '@nestjs/swagger'
import {AnilistCharacter} from '../../anilistCharacter/entities/anilistCharacter.entity.js'


export class AnilistCharacterName {
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
