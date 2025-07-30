
import {ApiProperty} from '@nestjs/swagger'




export class UpdateAnilibriaGenreEdgeDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
total_releases?: number  | null;
}
