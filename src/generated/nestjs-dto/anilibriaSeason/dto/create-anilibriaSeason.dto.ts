
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectAnilibriaDto} from '../../anilibria/dto/connect-anilibria.dto.js'

export class CreateAnilibriaSeasonAnilibriaRelationInputDto {
    @ApiProperty({
  type: ConnectAnilibriaDto,
})
connect: ConnectAnilibriaDto ;
  }

@ApiExtraModels(ConnectAnilibriaDto,CreateAnilibriaSeasonAnilibriaRelationInputDto)
export class CreateAnilibriaSeasonDto {
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
  type: CreateAnilibriaSeasonAnilibriaRelationInputDto,
})
anilibria: CreateAnilibriaSeasonAnilibriaRelationInputDto ;
}
