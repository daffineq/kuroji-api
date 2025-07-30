
import {ApiProperty} from '@nestjs/swagger'




export class ConnectTvdbLanguageTranslationDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
}
