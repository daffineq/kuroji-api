
import {ApiProperty} from '@nestjs/swagger'
import {KitsuDimension} from '../../kitsuDimension/entities/kitsuDimension.entity'
import {KitsuPosterImage} from '../../kitsuPosterImage/entities/kitsuPosterImage.entity'
import {KitsuCoverImage} from '../../kitsuCoverImage/entities/kitsuCoverImage.entity'


export class KitsuImageDimensions {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: () => KitsuDimension,
  required: false,
  nullable: true,
})
tiny?: KitsuDimension  | null;
@ApiProperty({
  type: () => KitsuDimension,
  required: false,
  nullable: true,
})
small?: KitsuDimension  | null;
@ApiProperty({
  type: () => KitsuDimension,
  required: false,
  nullable: true,
})
medium?: KitsuDimension  | null;
@ApiProperty({
  type: () => KitsuDimension,
  required: false,
  nullable: true,
})
large?: KitsuDimension  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
posterImageId: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
coverImageId: string  | null;
@ApiProperty({
  type: () => KitsuPosterImage,
  required: false,
  nullable: true,
})
posterImage?: KitsuPosterImage  | null;
@ApiProperty({
  type: () => KitsuCoverImage,
  required: false,
  nullable: true,
})
coverImage?: KitsuCoverImage  | null;
}
