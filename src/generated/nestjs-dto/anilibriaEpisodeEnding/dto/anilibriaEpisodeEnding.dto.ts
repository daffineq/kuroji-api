
import {ApiProperty} from '@nestjs/swagger'


export class AnilibriaEpisodeEndingDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
start: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
stop: number  | null;
}
