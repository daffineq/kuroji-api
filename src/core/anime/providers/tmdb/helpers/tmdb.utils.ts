import { Config } from 'src/config/config';

const getTmdbTypeByAl = (format: string | null | undefined): 'MOVIE' | 'SERIES' => {
  switch (format) {
    case 'MOVIE':
      return 'MOVIE';
    case 'TV':
    case 'ONA':
    case 'OVA':
    case 'SPECIAL':
    case 'TV_SHORT':
      return 'SERIES';
    default:
      return 'SERIES';
  }
};

const getImage = (size: 'w300' | 'w500' | 'w780' | 'w1280' | 'original', image: string | null): string | null => {
  return image ? `${Config.tmdb_image}${size}${image}` : null;
};

const TmdbUtils = {
  getTmdbTypeByAl,
  getImage
};

export { TmdbUtils };
