
import {ApiProperty} from '@nestjs/swagger'


export class AnilistCharacterEdgeDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
role: string  | null;
}
