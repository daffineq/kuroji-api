
import {ApiProperty} from '@nestjs/swagger'


export class AnilistVoiceNameDto {
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
}
