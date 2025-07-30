
import {ApiProperty} from '@nestjs/swagger'
import {AnilistStudioEdge} from '../../anilistStudioEdge/entities/anilistStudioEdge.entity.js'


export class AnilistStudio {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
name: string  | null;
@ApiProperty({
  type: () => Object,
  isArray: true,
  required: false,
})
animeLinks?: AnilistStudioEdge[] ;
}
