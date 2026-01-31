import { Config } from 'src/config/config';

const getImage = (size: 'w300' | 'w500' | 'w780' | 'w1280' | 'original', image: string | null): string | null => {
  return image ? `${Config.tmdb_image}${size}${image}` : null;
};

const TmdbUtils = {
  getImage
};

export { TmdbUtils };
