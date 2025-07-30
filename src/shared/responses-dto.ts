import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AnilistTag } from '../generated/nestjs-dto/anilistTag/entities/anilistTag.entity.js';
import { Anilist } from '../generated/nestjs-dto/anilist/entities/anilist.entity.js';
import { AniZip } from '../generated/nestjs-dto/aniZip/entities/aniZip.entity.js';

export class PageInfoDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  perPage: number;

  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  lastPage: number;

  @ApiProperty()
  hasNextPage: boolean;
}

export class ApiResponseAnilistDto {
  @ApiProperty({ type: () => PageInfoDto })
  @Type(() => PageInfoDto)
  pageInfo: PageInfoDto;

  @ApiProperty({ type: () => Anilist })
  @Type(() => Anilist)
  data: Anilist;
}

export class ApiResponseAnilisArraytDto {
  @ApiProperty({ type: () => PageInfoDto })
  @Type(() => PageInfoDto)
  pageInfo: PageInfoDto;

  @ApiProperty({ type: () => Anilist, isArray: true })
  @Type(() => Anilist)
  data: Anilist[];
}

export class ApiResponseAnilistTagDto {
  @ApiProperty({ type: () => PageInfoDto })
  @Type(() => PageInfoDto)
  pageInfo: PageInfoDto;

  @ApiProperty({ type: () => AnilistTag, isArray: true })
  @Type(() => AnilistTag)
  data: AnilistTag[];
}

export class ApiResponseAniZipDto {
  @ApiProperty({ type: () => PageInfoDto })
  @Type(() => PageInfoDto)
  pageInfo: PageInfoDto;

  @ApiProperty({ type: () => AniZip })
  @Type(() => AniZip)
  data: AniZip;
}
