
import {ApiProperty} from '@nestjs/swagger'




export class UpdateAnilibriaNameDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
main?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
english?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
alternative?: string  | null;
}
