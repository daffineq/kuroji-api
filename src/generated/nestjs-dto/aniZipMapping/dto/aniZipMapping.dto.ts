
import {ApiProperty} from '@nestjs/swagger'


export class AniZipMappingDto {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
animePlanetId: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
kitsuId: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
malId: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
type: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
anilistId: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
anisearchId: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
anidbId: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
notifymoeId: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
livechartId: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
thetvdbId: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
imdbId: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
themoviedbId: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
anilibriaId: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
zoroId: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
animepaheId: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
animekaiId: string  | null;
}
