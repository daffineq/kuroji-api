
import {ApiKeyRequestStatus,ApiKeyType} from '@prisma/client'
import {ApiProperty} from '@nestjs/swagger'
import {User} from '../../user/entities/user.entity'


export class ApiKeyRequest {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'string',
})
userId: string ;
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
  enum: ApiKeyRequestStatus,
  enumName: 'ApiKeyRequestStatus',
})
status: ApiKeyRequestStatus ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
reason: string  | null;
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
  type: () => User,
  required: false,
})
user?: User ;
}
