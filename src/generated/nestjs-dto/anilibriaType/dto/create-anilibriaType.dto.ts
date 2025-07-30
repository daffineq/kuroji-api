
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectAnilibriaDto} from '../../anilibria/dto/connect-anilibria.dto.js'

export class CreateAnilibriaTypeAnilibriaRelationInputDto {
    @ApiProperty({
  type: ConnectAnilibriaDto,
})
connect: ConnectAnilibriaDto ;
  }

@ApiExtraModels(ConnectAnilibriaDto,CreateAnilibriaTypeAnilibriaRelationInputDto)
export class CreateAnilibriaTypeDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
value?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
description?: string  | null;
@ApiProperty({
  type: CreateAnilibriaTypeAnilibriaRelationInputDto,
})
anilibria: CreateAnilibriaTypeAnilibriaRelationInputDto ;
}
