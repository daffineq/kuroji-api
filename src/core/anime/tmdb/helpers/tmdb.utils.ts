export function getTmdbTypeByAl(format: string | null | undefined): 'MOVIE' | 'SERIES' {
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
}
