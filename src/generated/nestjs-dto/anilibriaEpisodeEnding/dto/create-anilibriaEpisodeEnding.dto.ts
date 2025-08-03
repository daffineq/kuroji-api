
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectAnilibriaEpisodeDto} from '../../anilibriaEpisode/dto/connect-anilibriaEpisode.dto.js'

export class CreateAnilibriaEpisodeEndingEpisodeRelationInputDto {
    @ApiProperty({
  type: ConnectAnilibriaEpisodeDto,
})
connect: ConnectAnilibriaEpisodeDto ;
  }

@ApiExtraModels(ConnectAnilibriaEpisodeDto,CreateAnilibriaEpisodeEndingEpisodeRelationInputDto)
export class CreateAnilibriaEpisodeEndingDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
start?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
stop?: number  | null;
@ApiProperty({
  type: CreateAnilibriaEpisodeEndingEpisodeRelationInputDto,
})
episode: CreateAnilibriaEpisodeEndingEpisodeRelationInputDto ;
}
