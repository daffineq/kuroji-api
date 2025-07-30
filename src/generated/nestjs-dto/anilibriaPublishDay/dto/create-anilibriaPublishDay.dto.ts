
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectAnilibriaDto} from '../../anilibria/dto/connect-anilibria.dto.js'

export class CreateAnilibriaPublishDayAnilibriaRelationInputDto {
    @ApiProperty({
  type: ConnectAnilibriaDto,
})
connect: ConnectAnilibriaDto ;
  }

@ApiExtraModels(ConnectAnilibriaDto,CreateAnilibriaPublishDayAnilibriaRelationInputDto)
export class CreateAnilibriaPublishDayDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
value?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
description?: string  | null;
@ApiProperty({
  type: CreateAnilibriaPublishDayAnilibriaRelationInputDto,
})
anilibria: CreateAnilibriaPublishDayAnilibriaRelationInputDto ;
}
