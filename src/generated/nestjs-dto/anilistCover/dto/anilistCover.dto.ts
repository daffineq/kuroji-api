
import {ApiProperty} from '@nestjs/swagger'


export class AnilistCoverDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
color: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
large: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
medium: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
extraLarge: string  | null;
}
