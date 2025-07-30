
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectAnilibriaDto} from '../../anilibria/dto/connect-anilibria.dto.js'

export class CreateAnilibriaNameAnilibriaRelationInputDto {
    @ApiProperty({
  type: ConnectAnilibriaDto,
})
connect: ConnectAnilibriaDto ;
  }

@ApiExtraModels(ConnectAnilibriaDto,CreateAnilibriaNameAnilibriaRelationInputDto)
export class CreateAnilibriaNameDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
main?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
english?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
alternative?: string  | null;
@ApiProperty({
  type: CreateAnilibriaNameAnilibriaRelationInputDto,
})
anilibria: CreateAnilibriaNameAnilibriaRelationInputDto ;
}
