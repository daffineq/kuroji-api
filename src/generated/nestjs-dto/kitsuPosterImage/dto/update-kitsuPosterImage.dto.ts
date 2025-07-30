
import {ApiProperty} from '@nestjs/swagger'




export class UpdateKitsuPosterImageDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
tiny?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
small?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
medium?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
large?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
original?: string  | null;
}
