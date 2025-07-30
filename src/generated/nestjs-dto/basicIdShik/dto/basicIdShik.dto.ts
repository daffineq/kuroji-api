
import {ApiProperty} from '@nestjs/swagger'


export class BasicIdShikDto {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
malId: string  | null;
}
