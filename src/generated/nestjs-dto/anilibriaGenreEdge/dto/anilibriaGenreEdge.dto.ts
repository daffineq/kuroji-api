
import {ApiProperty} from '@nestjs/swagger'


export class AnilibriaGenreEdgeDto {
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
total_releases: number  | null;
}
