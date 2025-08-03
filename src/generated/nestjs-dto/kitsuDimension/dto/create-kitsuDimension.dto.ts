
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {ConnectKitsuImageDimensionsDto} from '../../kitsuImageDimensions/dto/connect-kitsuImageDimensions.dto.js'

export class CreateKitsuDimensionTinyDimensionRelationInputDto {
    @ApiProperty({
  type: ConnectKitsuImageDimensionsDto,
})
connect: ConnectKitsuImageDimensionsDto ;
  }
export class CreateKitsuDimensionSmallDimensionRelationInputDto {
    @ApiProperty({
  type: ConnectKitsuImageDimensionsDto,
})
connect: ConnectKitsuImageDimensionsDto ;
  }
export class CreateKitsuDimensionMediumDimensionRelationInputDto {
    @ApiProperty({
  type: ConnectKitsuImageDimensionsDto,
})
connect: ConnectKitsuImageDimensionsDto ;
  }
export class CreateKitsuDimensionLargeDimensionRelationInputDto {
    @ApiProperty({
  type: ConnectKitsuImageDimensionsDto,
})
connect: ConnectKitsuImageDimensionsDto ;
  }

@ApiExtraModels(ConnectKitsuImageDimensionsDto,CreateKitsuDimensionTinyDimensionRelationInputDto,ConnectKitsuImageDimensionsDto,CreateKitsuDimensionSmallDimensionRelationInputDto,ConnectKitsuImageDimensionsDto,CreateKitsuDimensionMediumDimensionRelationInputDto,ConnectKitsuImageDimensionsDto,CreateKitsuDimensionLargeDimensionRelationInputDto)
export class CreateKitsuDimensionDto {
  @ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
width?: number  | null;
@ApiProperty({
  type: 'integer',
  format: 'int32',
  required: false,
  nullable: true,
})
height?: number  | null;
@ApiProperty({
  required: false,
  type: CreateKitsuDimensionTinyDimensionRelationInputDto,
})
tinyDimension?: CreateKitsuDimensionTinyDimensionRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateKitsuDimensionSmallDimensionRelationInputDto,
})
smallDimension?: CreateKitsuDimensionSmallDimensionRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateKitsuDimensionMediumDimensionRelationInputDto,
})
mediumDimension?: CreateKitsuDimensionMediumDimensionRelationInputDto ;
@ApiProperty({
  required: false,
  type: CreateKitsuDimensionLargeDimensionRelationInputDto,
})
largeDimension?: CreateKitsuDimensionLargeDimensionRelationInputDto ;
}
