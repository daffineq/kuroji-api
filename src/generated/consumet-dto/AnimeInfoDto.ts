import { ApiProperty } from "@nestjs/swagger";
import {
  MediaStatus,
  SubOrSub,
  IAnimeEpisode,
  FuzzyDate,
  IAnimeResult,
} from '@consumet/extensions';

export interface Trailer {
  id: string;
  url?: string;
  site?: string;
  thumbnail?: string;
  thumbnailHash?: string | null;
}

export interface ExternalLink {
  id?: string;
  url?: string;
  sourceName?: string;
}

export class AnimeInfoDto {
    @ApiProperty()
    malId: string | number | undefined;
    @ApiProperty()
    genres: string[] | undefined;
    @ApiProperty()
    description: string | undefined;
    @ApiProperty()
    status: MediaStatus | undefined;
    @ApiProperty()
    totalEpisodes: number | undefined;
    @ApiProperty()
    subOrDub: SubOrSub | undefined;
    @ApiProperty()
    hasSub: boolean | undefined;
    @ApiProperty()
    hasDub: boolean | undefined;
    @ApiProperty()
    synonyms: string[] | undefined;
    @ApiProperty()
    countryOfOrigin: string | undefined;
    @ApiProperty()
    isAdult: boolean | undefined;
    @ApiProperty()
    isLicensed: boolean | undefined;
    @ApiProperty()
    season: string | undefined;
    @ApiProperty()
    studios: string[] | undefined;
    @ApiProperty()
    color: string | undefined;
    @ApiProperty()
    cover: string | undefined;
    @ApiProperty()
    externalLinks: ExternalLink[] | undefined;
    @ApiProperty()
    trailer: Trailer | undefined;
    @ApiProperty()
    episodes: IAnimeEpisode[] | undefined;
    @ApiProperty()
    startDate: FuzzyDate | undefined;
    @ApiProperty()
    endDate: FuzzyDate | undefined;
    @ApiProperty()
    recommendations: IAnimeResult[] | undefined;
    @ApiProperty()
    relations: IAnimeResult[] | undefined;
}
