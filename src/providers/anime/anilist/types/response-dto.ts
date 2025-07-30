import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class MediaTitleDto {
  @ApiProperty() romaji: string;
  @ApiProperty() english: string;
  @ApiProperty() native: string;
}

export class CoverImageDto {
  @ApiProperty() extraLarge: string;
  @ApiProperty() large: string;
  @ApiProperty() medium: string;
  @ApiPropertyOptional() color: string | null;
}

export class MediaRecommendationDto {
  @ApiProperty() id: number;
  @ApiProperty() idMal: number;
}

export class RecommendationNodeDto {
  @ApiProperty() id: number;
  @ApiProperty() rating: number;
  @ApiProperty({ type: MediaRecommendationDto })
  @Type(() => MediaRecommendationDto)
  mediaRecommendation: MediaRecommendationDto;
}

export class RecommendationEdgeDto {
  @ApiProperty({ type: RecommendationNodeDto })
  @Type(() => RecommendationNodeDto)
  node: RecommendationNodeDto;
}

export class RecommendationsDto {
  @ApiProperty({ type: [RecommendationEdgeDto] })
  @Type(() => RecommendationEdgeDto)
  edges: RecommendationEdgeDto[];
}

export class FuzzyDateDto {
  @ApiProperty() year: number;
  @ApiProperty() month: number;
  @ApiProperty() day: number;
}

export class TrailerDto {
  @ApiProperty() id: string;
  @ApiProperty() site: string;
  @ApiProperty() thumbnail: string;
}

export class MediaTagDto {
  @ApiProperty() id: number;
  @ApiProperty() name: string;
  @ApiProperty() description: string;
  @ApiProperty() category: string;
  @ApiProperty() rank: number;
  @ApiProperty() isGeneralSpoiler: boolean;
  @ApiProperty() isMediaSpoiler: boolean;
  @ApiProperty() isAdult: boolean;
}

export class MediaRankingDto {
  @ApiProperty() id: number;
  @ApiProperty() rank: number;
  @ApiProperty() type: string;
  @ApiProperty() format: string;
  @ApiProperty() year: number;
  @ApiProperty() season: string;
  @ApiProperty() allTime: boolean;
  @ApiProperty() context: string;
}

export class CharacterNameDto {
  @ApiProperty() full: string;
  @ApiProperty() native: string;
  @ApiProperty({ type: [String] }) alternative: string[];
}

export class CharacterImageDto {
  @ApiProperty() large: string;
  @ApiProperty() medium: string;
}

export class VoiceActorDto {
  @ApiProperty() id: number;
  @ApiProperty({ type: CharacterImageDto })
  @Type(() => CharacterImageDto)
  image: CharacterImageDto;
  @ApiProperty({ type: CharacterNameDto })
  @Type(() => CharacterNameDto)
  name: CharacterNameDto;
  @ApiProperty() languageV2: string;
}

export class CharacterNodeDto {
  @ApiProperty() id: number;
  @ApiProperty({ type: CharacterNameDto })
  @Type(() => CharacterNameDto)
  name: CharacterNameDto;
  @ApiProperty({ type: CharacterImageDto })
  @Type(() => CharacterImageDto)
  image: CharacterImageDto;
}

export class CharacterEdgeDto {
  @ApiProperty() id: number;
  @ApiProperty({ type: CharacterNodeDto })
  @Type(() => CharacterNodeDto)
  node: CharacterNodeDto;
  @ApiProperty() role: string;
  @ApiProperty({ type: [VoiceActorDto] })
  @Type(() => VoiceActorDto)
  voiceActors: VoiceActorDto[];
}

export class CharactersDto {
  @ApiProperty({ type: [CharacterEdgeDto] })
  @Type(() => CharacterEdgeDto)
  edges: CharacterEdgeDto[];
}

export class StudioNodeDto {
  @ApiProperty() id: number;
  @ApiProperty() name: string;
}

export class StudioEdgeDto {
  @ApiProperty() id: number;
  @ApiProperty() isMain: boolean;
  @ApiProperty({ type: StudioNodeDto })
  @Type(() => StudioNodeDto)
  node: StudioNodeDto;
}

export class StudiosDto {
  @ApiProperty({ type: [StudioEdgeDto] })
  @Type(() => StudioEdgeDto)
  edges: StudioEdgeDto[];
}

export class NextAiringEpisodeDto {
  @ApiProperty() id: number;
  @ApiProperty() airingAt: number;
  @ApiProperty() episode: number;
}

export class AiringScheduleNodeDto {
  @ApiProperty() id: number;
  @ApiProperty() airingAt: number;
  @ApiProperty() episode: number;
}

export class AiringScheduleEdgeDto {
  @ApiProperty({ type: AiringScheduleNodeDto })
  @Type(() => AiringScheduleNodeDto)
  node: AiringScheduleNodeDto;
}

export class AiringScheduleDto {
  @ApiProperty({ type: [AiringScheduleEdgeDto] })
  @Type(() => AiringScheduleEdgeDto)
  edges: AiringScheduleEdgeDto[];
}

export class ExternalLinkDto {
  @ApiProperty() id: number;
  @ApiProperty() url: string;
  @ApiProperty() site: string;
  @ApiPropertyOptional() siteId?: number;
  @ApiProperty() type: string;
  @ApiPropertyOptional() language?: string;
  @ApiPropertyOptional() color?: string;
  @ApiPropertyOptional() icon?: string;
  @ApiPropertyOptional() notes?: string;
  @ApiPropertyOptional() isDisabled?: boolean;
}

export class StreamingEpisodeDto {
  @ApiProperty() title: string;
  @ApiProperty() thumbnail: string;
  @ApiProperty() url: string;
  @ApiProperty() site: string;
}

export class ScoreDistributionDto {
  @ApiProperty() score: number;
  @ApiProperty() amount: number;
}

export class StatusDistributionDto {
  @ApiProperty() status: string;
  @ApiProperty() amount: number;
}

export class StatsDto {
  @ApiProperty({ type: [ScoreDistributionDto] })
  @Type(() => ScoreDistributionDto)
  scoreDistribution: ScoreDistributionDto[];
  @ApiProperty({ type: [StatusDistributionDto] })
  @Type(() => StatusDistributionDto)
  statusDistribution: StatusDistributionDto[];
}

export class FullMediaResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() idMal: number;
  @ApiProperty({ type: MediaTitleDto })
  @Type(() => MediaTitleDto)
  title: MediaTitleDto;
  @ApiProperty() status: string;
  @ApiProperty() type: string;
  @ApiProperty() format: string;
  @ApiProperty() updatedAt: number;
  @ApiProperty({ type: CoverImageDto })
  @Type(() => CoverImageDto)
  coverImage: CoverImageDto;
  @ApiProperty({ type: RecommendationsDto })
  @Type(() => RecommendationsDto)
  recommendations: RecommendationsDto;
  @ApiProperty() description: string;
  @ApiProperty({ type: FuzzyDateDto })
  @Type(() => FuzzyDateDto)
  startDate: FuzzyDateDto;
  @ApiProperty({ type: FuzzyDateDto })
  @Type(() => FuzzyDateDto)
  endDate: FuzzyDateDto;
  @ApiProperty() season: string;
  @ApiProperty() seasonYear: number;
  @ApiProperty() episodes: number;
  @ApiProperty() duration: number;
  @ApiProperty() countryOfOrigin: string;
  @ApiProperty() isLicensed: boolean;
  @ApiProperty() source: string;
  @ApiProperty() hashtag: string;
  @ApiPropertyOptional({ type: TrailerDto })
  @Type(() => TrailerDto)
  trailer: TrailerDto | null;
  @ApiProperty({ type: [String] }) genres: string[];
  @ApiProperty({ type: [String] }) synonyms: string[];
  @ApiProperty() averageScore: number;
  @ApiProperty() meanScore: number;
  @ApiProperty() popularity: number;
  @ApiProperty() isLocked: boolean;
  @ApiProperty() trending: number;
  @ApiProperty() favourites: number;
  @ApiProperty({ type: [MediaTagDto] })
  @Type(() => MediaTagDto)
  tags: MediaTagDto[];
  @ApiProperty({ type: [MediaRankingDto] })
  @Type(() => MediaRankingDto)
  rankings: MediaRankingDto[];
  @ApiProperty({ type: CharactersDto })
  @Type(() => CharactersDto)
  characters: CharactersDto;
  @ApiProperty({ type: StudiosDto })
  @Type(() => StudiosDto)
  studios: StudiosDto;
  @ApiProperty() isAdult: boolean;
  @ApiPropertyOptional({ type: NextAiringEpisodeDto })
  @Type(() => NextAiringEpisodeDto)
  nextAiringEpisode: NextAiringEpisodeDto | null;
  @ApiProperty({ type: AiringScheduleDto })
  @Type(() => AiringScheduleDto)
  airingSchedule: AiringScheduleDto;
  @ApiProperty({ type: [ExternalLinkDto] })
  @Type(() => ExternalLinkDto)
  externalLinks: ExternalLinkDto[];
  @ApiProperty({ type: [StreamingEpisodeDto] })
  @Type(() => StreamingEpisodeDto)
  streamingEpisodes: StreamingEpisodeDto[];
  @ApiProperty({ type: StatsDto })
  @Type(() => StatsDto)
  stats: StatsDto;
  @ApiProperty() bannerImage: string;
}
