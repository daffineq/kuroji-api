
import {ApiProperty} from '@nestjs/swagger'


export class KitsuStreamingLinksDto {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'string',
})
selfLink: string ;
@ApiProperty({
  type: 'string',
})
related: string ;
}
