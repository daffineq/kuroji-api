
import {ApiProperty} from '@nestjs/swagger'


export class AnilistNextEpisodeDto {
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
episode: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
airingAt: number  | null;
}
