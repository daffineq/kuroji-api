
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectShikimoriDto} from '../../shikimori/dto/connect-shikimori.dto'

export class CreateReleasedOnShikimoriRelationInputDto {
    @ApiProperty({
  type: ConnectShikimoriDto,
})
connect: ConnectShikimoriDto ;
  }

@ApiExtraModels(ConnectShikimoriDto,CreateReleasedOnShikimoriRelationInputDto)
export class CreateReleasedOnDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
year?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
month?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
day?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
date?: string  | null;
@ApiProperty({
  type: CreateReleasedOnShikimoriRelationInputDto,
})
shikimori: CreateReleasedOnShikimoriRelationInputDto ;
}
