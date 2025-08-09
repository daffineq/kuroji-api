
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectApiKeyDto} from '../../apiKey/dto/connect-apiKey.dto'

export class CreateApiKeyUsageApiKeyRelationInputDto {
    @ApiProperty({
  type: ConnectApiKeyDto,
})
connect: ConnectApiKeyDto ;
  }

@ApiExtraModels(ConnectApiKeyDto,CreateApiKeyUsageApiKeyRelationInputDto)
export class CreateApiKeyUsageDto {
  @ApiProperty({
  type: 'string',
})
endpoint: string ;
@ApiProperty({
  type: 'string',
})
method: string ;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
origin?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
userAgent?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
ip?: string  | null;
@ApiProperty({
  type: CreateApiKeyUsageApiKeyRelationInputDto,
})
apiKey: CreateApiKeyUsageApiKeyRelationInputDto ;
}
