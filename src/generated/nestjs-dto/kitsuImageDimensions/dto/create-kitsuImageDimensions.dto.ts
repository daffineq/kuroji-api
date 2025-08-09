
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectKitsuDimensionDto} from '../../kitsuDimension/dto/connect-kitsuDimension.dto'
import {ConnectKitsuPosterImageDto} from '../../kitsuPosterImage/dto/connect-kitsuPosterImage.dto'
import {ConnectKitsuCoverImageDto} from '../../kitsuCoverImage/dto/connect-kitsuCoverImage.dto'

export class CreateKitsuImageDimensionsTinyRelationInputDto {
    @ApiProperty({
  type: ConnectKitsuDimensionDto,
})
connect: ConnectKitsuDimensionDto ;
  }
export class CreateKitsuImageDimensionsSmallRelationInputDto {
    @ApiProperty({
  type: ConnectKitsuDimensionDto,
})
connect: ConnectKitsuDimensionDto ;
  }
export class CreateKitsuImageDimensionsMediumRelationInputDto {
    @ApiProperty({
  type: ConnectKitsuDimensionDto,
})
connect: ConnectKitsuDimensionDto ;
  }
export class CreateKitsuImageDimensionsLargeRelationInputDto {
    @ApiProperty({
  type: ConnectKitsuDimensionDto,
})
connect: ConnectKitsuDimensionDto ;
  }
export class CreateKitsuImageDimensionsPosterImageRelationInputDto {
    @ApiProperty({
  type: ConnectKitsuPosterImageDto,
})
connect: ConnectKitsuPosterImageDto ;
  }
export class CreateKitsuImageDimensionsCoverImageRelationInputDto {
    @ApiProperty({
  type: ConnectKitsuCoverImageDto,
})
connect: ConnectKitsuCoverImageDto ;
  }

@ApiExtraModels(ConnectKitsuDimensionDto,CreateKitsuImageDimensionsTinyRelationInputDto,ConnectKitsuDimensionDto,CreateKitsuImageDimensionsSmallRelationInputDto,ConnectKitsuDimensionDto,CreateKitsuImageDimensionsMediumRelationInputDto,ConnectKitsuDimensionDto,CreateKitsuImageDimensionsLargeRelationInputDto,ConnectKitsuPosterImageDto,CreateKitsuImageDimensionsPosterImageRelationInputDto,ConnectKitsuCoverImageDto,CreateKitsuImageDimensionsCoverImageRelationInputDto)
export class CreateKitsuImageDimensionsDto {
  @ApiProperty({
  required: false,
  type: CreateKitsuImageDimensionsTinyRelationInputDto,
})
tiny?: CreateKitsuImageDimensionsTinyRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateKitsuImageDimensionsSmallRelationInputDto,
})
small?: CreateKitsuImageDimensionsSmallRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateKitsuImageDimensionsMediumRelationInputDto,
})
medium?: CreateKitsuImageDimensionsMediumRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateKitsuImageDimensionsLargeRelationInputDto,
})
large?: CreateKitsuImageDimensionsLargeRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateKitsuImageDimensionsPosterImageRelationInputDto,
})
posterImage?: CreateKitsuImageDimensionsPosterImageRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateKitsuImageDimensionsCoverImageRelationInputDto,
})
coverImage?: CreateKitsuImageDimensionsCoverImageRelationInputDto ;
}
