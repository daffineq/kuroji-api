
import {ApiProperty} from '@nestjs/swagger'


export class AnilistTagEdgeDto {
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
rank: number  | null;
@ApiProperty({
  type: 'boolean',
  nullable: true,
})
isMediaSpoiler: boolean  | null;
}
