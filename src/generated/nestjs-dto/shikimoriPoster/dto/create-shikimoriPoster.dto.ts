
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectShikimoriDto} from '../../shikimori/dto/connect-shikimori.dto'

export class CreateShikimoriPosterShikimoriRelationInputDto {
    @ApiProperty({
  type: ConnectShikimoriDto,
})
connect: ConnectShikimoriDto ;
  }

@ApiExtraModels(ConnectShikimoriDto,CreateShikimoriPosterShikimoriRelationInputDto)
export class CreateShikimoriPosterDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
originalUrl?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
mainUrl?: string  | null;
@ApiProperty({
  type: CreateShikimoriPosterShikimoriRelationInputDto,
})
shikimori: CreateShikimoriPosterShikimoriRelationInputDto ;
}
