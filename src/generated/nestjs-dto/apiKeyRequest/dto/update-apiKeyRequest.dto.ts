
import {ApiProperty} from '@nestjs/swagger'




export class UpdateApiKeyRequestDto {
  @ApiProperty({
  type: 'string',
  required: false,
})
whatFor?: string ;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
reason?: string  | null;
}
