
import {ApiProperty} from '@nestjs/swagger'


export class BasicIdAniDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
idMal: number  | null;
}
