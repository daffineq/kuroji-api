
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {CreateApiKeyDto} from '../../apiKey/dto/create-apiKey.dto.js'
import {ConnectApiKeyDto} from '../../apiKey/dto/connect-apiKey.dto.js'
import {CreateApiKeyRequestDto} from '../../apiKeyRequest/dto/create-apiKeyRequest.dto.js'
import {ConnectApiKeyRequestDto} from '../../apiKeyRequest/dto/connect-apiKeyRequest.dto.js'

export class CreateUserApiKeysRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateApiKeyDto,
  isArray: true,
})
create?: CreateApiKeyDto[] ;
@ApiProperty({
  required: false,
  type: ConnectApiKeyDto,
  isArray: true,
})
connect?: ConnectApiKeyDto[] ;
  }
export class CreateUserApiKeyRequestsRelationInputDto {
    @ApiProperty({
  required: false,
  type: CreateApiKeyRequestDto,
  isArray: true,
})
create?: CreateApiKeyRequestDto[] ;
@ApiProperty({
  required: false,
  type: ConnectApiKeyRequestDto,
  isArray: true,
})
connect?: ConnectApiKeyRequestDto[] ;
  }

@ApiExtraModels(CreateApiKeyDto,ConnectApiKeyDto,CreateUserApiKeysRelationInputDto,CreateApiKeyRequestDto,ConnectApiKeyRequestDto,CreateUserApiKeyRequestsRelationInputDto)
export class CreateUserDto {
  @ApiProperty({
  type: 'string',
})
email: string ;
@ApiProperty({
  type: 'string',
})
password: string ;
@ApiProperty({
  type: 'string',
})
name: string ;
@ApiProperty({
  required: false,
  type: CreateUserApiKeysRelationInputDto,
})
apiKeys?: CreateUserApiKeysRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateUserApiKeyRequestsRelationInputDto,
})
apiKeyRequests?: CreateUserApiKeyRequestsRelationInputDto ;
}
