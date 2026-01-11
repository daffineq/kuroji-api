import { Image } from '@crysoline/lib/dist/core/types';

export interface EpisodeProvider {
  name: string;
  id: string | number | null;
}

export interface Episode {
  title?: string | null;
  image?: Image | string | null;
  description?: string | null;
  number?: number | null;
  sub?: boolean | false;
  dub?: boolean | false;
  is_filler?: boolean | false;
  providers: EpisodeProvider[];
}
