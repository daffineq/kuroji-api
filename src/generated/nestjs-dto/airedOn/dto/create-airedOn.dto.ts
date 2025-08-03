
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectShikimoriDto} from '../../shikimori/dto/connect-shikimori.dto.js'

export class CreateAiredOnShikimoriRelationInputDto {
    @ApiProperty({
  type: ConnectShikimoriDto,
})
connect: ConnectShikimoriDto ;
  }

@ApiExtraModels(ConnectShikimoriDto,CreateAiredOnShikimoriRelationInputDto)
export class CreateAiredOnDto {
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
  type: CreateAiredOnShikimoriRelationInputDto,
})
shikimori: CreateAiredOnShikimoriRelationInputDto ;
}
