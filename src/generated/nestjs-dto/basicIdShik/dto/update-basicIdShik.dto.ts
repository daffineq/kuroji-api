
import {ApiProperty} from '@nestjs/swagger'




export class UpdateBasicIdShikDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
malId?: string  | null;
}
