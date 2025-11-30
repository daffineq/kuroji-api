import env from 'src/config/env';

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
  return image ? `${env.TMDB_IMAGE}${size}${image}` : null;
};

const TmdbUtils = {
  getTmdbTypeByAl,
  getImage
};

export { TmdbUtils };
