
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectAnilibriaDto} from '../../anilibria/dto/connect-anilibria.dto'

export class CreateAnilibriaAgeRatingAnilibriaRelationInputDto {
    @ApiProperty({
  type: ConnectAnilibriaDto,
})
connect: ConnectAnilibriaDto ;
  }

@ApiExtraModels(ConnectAnilibriaDto,CreateAnilibriaAgeRatingAnilibriaRelationInputDto)
export class CreateAnilibriaAgeRatingDto {
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
label?: string  | null;
@ApiProperty({
  type: 'boolean',
  required: false,
  nullable: true,
})
is_adult?: boolean  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
description?: string  | null;
@ApiProperty({
  type: CreateAnilibriaAgeRatingAnilibriaRelationInputDto,
})
anilibria: CreateAnilibriaAgeRatingAnilibriaRelationInputDto ;
}
