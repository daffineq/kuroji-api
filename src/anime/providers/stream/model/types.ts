export enum SourceType {
  soft_sub = 'soft_sub',
  hard_sub = 'hard_sub',
  dub = 'dub',
  both = 'both',
}

export enum Provider {
  zoro = 'zoro',
  animekai = 'animekai',
  animepahe = 'animepahe',
}

export interface Episode {
  title: string | null
  image: string
  number: number | null
  overview: string
  date: string
  duration: number
  filler: boolean | null
  sub: boolean | null
  dub: boolean | null
}

export interface ProviderInfo {
  id: string,
  filler: boolean,
  provider: Provider,
  type: SourceType
}
