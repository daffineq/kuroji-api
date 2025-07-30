
import {ApiProperty} from '@nestjs/swagger'


export class KitsuCoverImageDto {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
tiny: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
small: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
large: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
original: string  | null;
}
