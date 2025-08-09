
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {CreateShikimoriDto} from '../../shikimori/dto/create-shikimori.dto'
import {ConnectShikimoriDto} from '../../shikimori/dto/connect-shikimori.dto'

export class CreateShikimoriScreenshotShikimoriRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateShikimoriDto,
  isArray: true,
})
create?: CreateShikimoriDto[] ;
@ApiProperty({
  required: false,
  type: ConnectShikimoriDto,
  isArray: true,
})
connect?: ConnectShikimoriDto[] ;
  }

@ApiExtraModels(CreateShikimoriDto,ConnectShikimoriDto,CreateShikimoriScreenshotShikimoriRelationInputDto)
export class CreateShikimoriScreenshotDto {
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
x166Url?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
x332Url?: string  | null;
@ApiProperty({
  required: false,
  type: CreateShikimoriScreenshotShikimoriRelationInputDto,
})
shikimori?: CreateShikimoriScreenshotShikimoriRelationInputDto ;
}
