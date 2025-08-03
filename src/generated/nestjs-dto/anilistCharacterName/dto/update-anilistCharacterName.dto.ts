
import {ApiProperty} from '@nestjs/swagger'




export class UpdateAnilistCharacterNameDto {
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
  required: false,
})
alternative?: string[] ;
}
