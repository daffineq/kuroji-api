
import {ApiProperty} from '@nestjs/swagger'


export class AniZipEpisodeTitleDto {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'string',
})
key: string ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
name: string  | null;
}
