
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectUserDto} from '../../user/dto/connect-user.dto'

export class CreateApiKeyRequestUserRelationInputDto {
    @ApiProperty({
  type: ConnectUserDto,
})
connect: ConnectUserDto ;
  }

@ApiExtraModels(ConnectUserDto,CreateApiKeyRequestUserRelationInputDto)
export class CreateApiKeyRequestDto {
  @ApiProperty({
  type: 'string',
})
whatFor: string ;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
reason?: string  | null;
@ApiProperty({
  type: CreateApiKeyRequestUserRelationInputDto,
})
user: CreateApiKeyRequestUserRelationInputDto ;
}
