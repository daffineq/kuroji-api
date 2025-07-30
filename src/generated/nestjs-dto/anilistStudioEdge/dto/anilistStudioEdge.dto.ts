
import {ApiProperty} from '@nestjs/swagger'


export class AnilistStudioEdgeDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'boolean',
  nullable: true,
})
isMain: boolean  | null;
}
