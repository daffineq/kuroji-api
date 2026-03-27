export interface ZerochanArtwork {
  id: number;
  width: number;
  height: number;
  md5: string;
  thumbnail: string;
  source: string;
  tag: string;
  tags: string[];
}

export interface ZerochanSuggestion {
  value: string;
  type: string;
  total: number;
}
