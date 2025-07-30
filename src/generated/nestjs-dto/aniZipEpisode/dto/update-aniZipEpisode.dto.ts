
import {ApiProperty} from '@nestjs/swagger'




export class UpdateAniZipEpisodeDto {
  @ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
episodeKey?: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
episodeNumber?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
seasonNumber?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
absoluteEpisodeNumber?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
tvdbShowId?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
tvdbId?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
airDate?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
airDateUtc?: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
runtime?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
length?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
overview?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
image?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
rating?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
episode?: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
anidbEid?: number  | null;
}
