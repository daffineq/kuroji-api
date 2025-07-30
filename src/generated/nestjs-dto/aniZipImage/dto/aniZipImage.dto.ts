
import {ApiProperty} from '@nestjs/swagger'


export class AniZipImageDto {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
coverType: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
url: string  | null;
}
