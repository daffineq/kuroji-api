
import {ApiKeyType} from '@prisma/client'
import {ApiProperty} from '@nestjs/swagger'


export class ApiKeyDto {
  @ApiProperty({
  type: 'string',
})
id: string ;
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
}
