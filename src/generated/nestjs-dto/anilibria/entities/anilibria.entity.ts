
import {ApiProperty} from '@nestjs/swagger'
import {AnilibriaType} from '../../anilibriaType/entities/anilibriaType.entity.js'
import {AnilibriaName} from '../../anilibriaName/entities/anilibriaName.entity.js'
import {AnilibriaSeason} from '../../anilibriaSeason/entities/anilibriaSeason.entity.js'
import {AnilibriaPoster} from '../../anilibriaPoster/entities/anilibriaPoster.entity.js'
import {AnilibriaAgeRating} from '../../anilibriaAgeRating/entities/anilibriaAgeRating.entity.js'
import {AnilibriaSponsor} from '../../anilibriaSponsor/entities/anilibriaSponsor.entity.js'
import {AnilibriaPublishDay} from '../../anilibriaPublishDay/entities/anilibriaPublishDay.entity.js'
import {AnilibriaGenreEdge} from '../../anilibriaGenreEdge/entities/anilibriaGenreEdge.entity.js'
import {AnilibriaEpisode} from '../../anilibriaEpisode/entities/anilibriaEpisode.entity.js'
import {AnilibriaTorrent} from '../../anilibriaTorrent/entities/anilibriaTorrent.entity.js'
import {Anilist} from '../../anilist/entities/anilist.entity.js'


export class Anilibria {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
})
id: number ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
anilist_id: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
year: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
alias: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
fresh_at: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
created_at: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
updated_at: string  | null;
@ApiProperty({
  type: 'boolean',
  nullable: true,
})
is_ongoing: boolean  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
description: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
notification: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
episodes_total: number  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
external_player: string  | null;
@ApiProperty({
  type: 'boolean',
  nullable: true,
})
is_in_production: boolean  | null;
@ApiProperty({
  type: 'boolean',
  nullable: true,
})
is_blocked_by_copyrights: boolean  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
added_in_users_favorites: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
average_duration_of_episode: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
added_in_planned_collection: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
added_in_watched_collection: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
added_in_watching_collection: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
added_in_postponed_collection: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  nullable: true,
})
added_in_abandoned_collection: number  | null;
@ApiProperty({
  type: () => Object,
  required: false,
  nullable: true,
})
type?: AnilibriaType  | null;
@ApiProperty({
  type: () => Object,
  required: false,
  nullable: true,
})
name?: AnilibriaName  | null;
@ApiProperty({
  type: () => Object,
  required: false,
  nullable: true,
})
season?: AnilibriaSeason  | null;
@ApiProperty({
  type: () => Object,
  required: false,
  nullable: true,
})
poster?: AnilibriaPoster  | null;
@ApiProperty({
  type: () => Object,
  required: false,
  nullable: true,
})
age_rating?: AnilibriaAgeRating  | null;
@ApiProperty({
  type: () => Object,
  required: false,
  nullable: true,
})
sponsor?: AnilibriaSponsor  | null;
@ApiProperty({
  type: () => Object,
  required: false,
  nullable: true,
})
publish_day?: AnilibriaPublishDay  | null;
@ApiProperty({
  type: () => Object,
  isArray: true,
  required: false,
})
genres?: AnilibriaGenreEdge[] ;
@ApiProperty({
  type: () => Object,
  isArray: true,
  required: false,
})
episodes?: AnilibriaEpisode[] ;
@ApiProperty({
  type: () => Object,
  isArray: true,
  required: false,
})
torrents?: AnilibriaTorrent[] ;
@ApiProperty({
  type: () => Object,
  required: false,
  nullable: true,
})
anilist?: Anilist  | null;
}
