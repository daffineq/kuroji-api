
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {CreateApiKeyUsageDto} from '../../apiKeyUsage/dto/create-apiKeyUsage.dto'
import {ConnectApiKeyUsageDto} from '../../apiKeyUsage/dto/connect-apiKeyUsage.dto'
import {ConnectUserDto} from '../../user/dto/connect-user.dto'

export class CreateApiKeyUsageRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateApiKeyUsageDto,
  isArray: true,
})
create?: CreateApiKeyUsageDto[] ;
@ApiProperty({
  required: false,
  type: ConnectApiKeyUsageDto,
  isArray: true,
})
connect?: ConnectApiKeyUsageDto[] ;
  }
export class CreateApiKeyUserRelationInputDto {
    @ApiProperty({
  type: ConnectUserDto,
})
connect: ConnectUserDto ;
  }

@ApiExtraModels(CreateApiKeyUsageDto,ConnectApiKeyUsageDto,CreateApiKeyUsageRelationInputDto,ConnectUserDto,CreateApiKeyUserRelationInputDto)
export class CreateApiKeyDto {
  @ApiProperty({
  type: 'string',
})
key: string ;
@ApiProperty({
  type: 'string',
})
whatFor: string ;
@ApiProperty({
  required: false,
  type: CreateApiKeyUsageRelationInputDto,
})
usage?: CreateApiKeyUsageRelationInputDto ;
@ApiProperty({
  type: CreateApiKeyUserRelationInputDto,
})
user: CreateApiKeyUserRelationInputDto ;
}
