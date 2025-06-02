// Base Types
export interface MediaTitle {
  romaji: string;
  english: string;
  native: string;
}

export interface CoverImage {
  extraLarge: string;
  large: string;
  medium: string;
  color: string | null;
}

// Recommendations
export interface MediaRecommendation {
  id: number;
  idMal: number;
}

export interface RecommendationNode {
  id: number;
  rating: number;
  mediaRecommendation: MediaRecommendation;
}

export interface RecommendationEdge {
  node: RecommendationNode;
}

export interface Recommendations {
  edges: RecommendationEdge[];
}

// Dates
export interface FuzzyDate {
  year: number;
  month: number;
  day: number;
}

// Trailer
export interface Trailer {
  id: string;
  site: string;
  thumbnail: string;
}

// Tags
export interface MediaTag {
  id: number;
  name: string;
  description: string;
  category: string;
  rank: number;
  isGeneralSpoiler: boolean;
  isMediaSpoiler: boolean;
  isAdult: boolean;
}

// Rankings
export interface MediaRanking {
  id: number;
  rank: number;
  type: string;
  format: string;
  year: number;
  season: string;
  allTime: boolean;
  context: string;
}

// Characters & Voice Actors
export interface CharacterName {
  full: string;
  native: string;
  alternative: string[];
}

export interface CharacterImage {
  large: string;
  medium: string;
}

export interface VoiceActor {
  id: number;
  image: CharacterImage;
  name: CharacterName;
  languageV2: string;
}

export interface CharacterNode {
  id: number;
  name: CharacterName;
  image: CharacterImage;
}

export interface CharacterEdge {
  id: number;
  node: CharacterNode;
  role: string;
  voiceActors: VoiceActor[];
}

export interface Characters {
  edges: CharacterEdge[];
}

// Studios
export interface StudioNode {
  id: number;
  name: string;
}

export interface StudioEdge {
  id: number;
  isMain: boolean;
  node: StudioNode;
}

export interface Studios {
  edges: StudioEdge[];
}

// Airing
export interface NextAiringEpisode {
  id: number;
  airingAt: number;
  episode: number;
}

export interface AiringScheduleNode {
  id: number;
  airingAt: number;
  episode: number;
}

export interface AiringScheduleEdge {
  node: AiringScheduleNode;
}

export interface AiringSchedule {
  edges: AiringScheduleEdge[];
}

// External Links
export interface ExternalLink {
  id: number;
  url: string;
  site: string;
  siteId?: number;
  type: string;
  language?: string;
  color?: string;
  icon?: string;
  notes?: string;
  isDisabled?: boolean;
}

// Streaming
export interface StreamingEpisode {
  title: string;
  thumbnail: string;
  url: string;
  site: string;
}

// Stats
export interface ScoreDistribution {
  score: number;
  amount: number;
}

export interface StatusDistribution {
  status: string;
  amount: number;
}

export interface Stats {
  scoreDistribution: ScoreDistribution[];
  statusDistribution: StatusDistribution[];
}

// Full Response
export interface FullMediaResponse {
  id: number;
  idMal: number;
  title: MediaTitle;
  status: string;
  type: string;
  format: string;
  updatedAt: number;
  coverImage: CoverImage;
  recommendations: Recommendations;
  description: string;
  startDate: FuzzyDate;
  endDate: FuzzyDate;
  season: string;
  seasonYear: number;
  episodes: number;
  duration: number;
  countryOfOrigin: string;
  isLicensed: boolean;
  source: string;
  hashtag: string;
  trailer: Trailer | null;
  genres: string[];
  synonyms: string[];
  averageScore: number;
  meanScore: number;
  popularity: number;
  isLocked: boolean;
  trending: number;
  favourites: number;
  tags: MediaTag[];
  rankings: MediaRanking[];
  characters: Characters;
  studios: Studios;
  isAdult: boolean;
  nextAiringEpisode: NextAiringEpisode | null;
  airingSchedule: AiringSchedule;
  externalLinks: ExternalLink[];
  streamingEpisodes: StreamingEpisode[];
  stats: Stats;
  bannerImage: string;
}
