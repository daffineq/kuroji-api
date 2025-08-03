
import {ApiProperty} from '@nestjs/swagger'


export class VoiceActorDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
language: string  | null;
}
