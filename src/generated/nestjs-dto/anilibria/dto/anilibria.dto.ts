
import {ApiProperty} from '@nestjs/swagger'


export class AnilibriaDto {
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
}
