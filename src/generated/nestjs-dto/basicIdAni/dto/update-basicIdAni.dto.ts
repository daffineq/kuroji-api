
import {ApiProperty} from '@nestjs/swagger'




export class UpdateBasicIdAniDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
idMal?: number  | null;
}
