
import {ApiProperty} from '@nestjs/swagger'


export class AnilistCharacterDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
}
