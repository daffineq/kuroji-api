
import {ApiProperty} from '@nestjs/swagger'




export class UpdateAniZipTitleDto {
  @ApiProperty({
  type: 'string',
  required: false,
})
key?: string ;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
name?: string  | null;
}
