export type MappingEntry = {
  id: string | number;
  name: string;
};

export interface TitleEntry {
  title: string;
  source: string;
  language: string;
}

export interface DescriptionEntry {
  description: string;
  source: string;
  language: string;
}

export interface ImageEntry {
  url: string;
  small?: string | null;
  medium?: string | null;
  large?: string | null;
  type: 'poster' | 'background';
  source: string;
}

export interface ScreenshotEntry {
  url: string;
  small?: string;
  medium?: string;
  large?: string;
  source: string;
}

export interface VideoEntry {
  url: string;
  title?: string;
  thumbnail?: string;
  artist?: string;
  type?: string;
  source: string;
}

export interface ArtworkEntry {
  url: string;
  height?: number;
  image?: string;
  iso_639_1?: string;
  thumbnail?: string;
  type: string;
  width?: number;
  source: string;
}

export interface ChronologyEntry {
  parentId: number;
  relatedId: number;
  order: number;
}

export interface MetaPayload {
  // Scalar fields
  franchise?: string | null;
  rating?: string | null;
  episodes_aired?: number | null;
  episodes_total?: number | null;
  moreinfo?: string | null;
  broadcast?: string | null;
  nsfw?: boolean;

  // Relational fields
  mappings?: MappingEntry[] | MappingEntry;
  titles?: TitleEntry[] | TitleEntry;
  descriptions?: DescriptionEntry[] | DescriptionEntry;
  images?: ImageEntry[] | ImageEntry;
  videos?: VideoEntry[] | VideoEntry;
  screenshots?: ScreenshotEntry[] | ScreenshotEntry;
  artworks?: ArtworkEntry[] | ArtworkEntry;
  chronologies?: ChronologyEntry[] | ChronologyEntry;
}
