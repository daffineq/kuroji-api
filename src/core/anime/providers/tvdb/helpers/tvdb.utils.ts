const getTvdbTypeByAl = (format: string | null | undefined): 'movie' | 'series' => {
  switch (format) {
    case 'MOVIE':
      return 'movie';
    case 'TV':
    case 'ONA':
    case 'OVA':
    case 'SPECIAL':
    case 'TV_SHORT':
      return 'series';
    default:
      return 'series';
  }
};

const TvdbUtils = {
  getTvdbTypeByAl
};

export { TvdbUtils };
