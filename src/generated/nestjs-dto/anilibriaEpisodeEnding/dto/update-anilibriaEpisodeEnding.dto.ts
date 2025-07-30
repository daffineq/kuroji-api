
import {ApiProperty} from '@nestjs/swagger'




export class UpdateAnilibriaEpisodeEndingDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
start?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
stop?: number  | null;
}
