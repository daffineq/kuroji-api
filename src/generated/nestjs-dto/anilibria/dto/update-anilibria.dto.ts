
import {ApiProperty} from '@nestjs/swagger'




export class UpdateAnilibriaDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
year?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
alias?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
fresh_at?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
created_at?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
updated_at?: string  | null;
@ApiProperty({
  type: 'boolean',
  required: false,
  nullable: true,
})
is_ongoing?: boolean  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
description?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
notification?: string  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
episodes_total?: number  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
external_player?: string  | null;
@ApiProperty({
  type: 'boolean',
  required: false,
  nullable: true,
})
is_in_production?: boolean  | null;
@ApiProperty({
  type: 'boolean',
  required: false,
  nullable: true,
})
is_blocked_by_copyrights?: boolean  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
added_in_users_favorites?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
average_duration_of_episode?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
added_in_planned_collection?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
added_in_watched_collection?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
added_in_watching_collection?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
added_in_postponed_collection?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
added_in_abandoned_collection?: number  | null;
}
