
import {ApiKeyType} from '@prisma/client'
import {ApiProperty} from '@nestjs/swagger'
import {ApiKeyUsage} from '../../apiKeyUsage/entities/apiKeyUsage.entity'
import {User} from '../../user/entities/user.entity'


export class ApiKey {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'string',
})
userId: string ;
@ApiProperty({
  type: 'string',
})
key: string ;
@ApiProperty({
  enum: ApiKeyType,
  enumName: 'ApiKeyType',
})
type: ApiKeyType ;
@ApiProperty({
  type: 'string',
})
whatFor: string ;
@ApiProperty({
  type: 'boolean',
})
active: boolean ;
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
  type: () => ApiKeyUsage,
  isArray: true,
  required: false,
})
usage?: ApiKeyUsage[] ;
@ApiProperty({
  type: () => User,
  required: false,
})
user?: User ;
}
