
import {UserRole} from '@prisma/client'
import {ApiProperty} from '@nestjs/swagger'
import {ApiKey} from '../../apiKey/entities/apiKey.entity.js'
import {ApiKeyRequest} from '../../apiKeyRequest/entities/apiKeyRequest.entity.js'


export class User {
  @ApiProperty({
  type: 'string',
})
id: string ;
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
  enum: UserRole,
  enumName: 'UserRole',
})
role: UserRole ;
@ApiProperty({
  type: 'string',
  format: 'date-time',
})
createdAt: Date ;
@ApiProperty({
  type: 'string',
  format: 'date-time',
})
updatedAt: Date ;
@ApiProperty({
  type: () => Object,
  isArray: true,
  required: false,
})
apiKeys?: ApiKey[] ;
@ApiProperty({
  type: () => Object,
  isArray: true,
  required: false,
})
apiKeyRequests?: ApiKeyRequest[] ;
}
