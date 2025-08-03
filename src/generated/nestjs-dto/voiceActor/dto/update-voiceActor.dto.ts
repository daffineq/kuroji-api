
import {ApiProperty} from '@nestjs/swagger'




export class UpdateVoiceActorDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
language?: string  | null;
}
