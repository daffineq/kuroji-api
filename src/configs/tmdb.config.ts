import Config from './config.js';

export class TMDB {
  public static readonly API_KEY: string = Config.TMDB_API || '';
  public static readonly IMAGE_BASE_URL: string = 'https://image.tmdb.org/t/p/';
  public static readonly IMAGE_BASE_ORIGINAL_URL: string =
    TMDB.getImageUrl('original');

  // Image URL Generator
  public static getImageUrl(width: string): string {
    return TMDB.IMAGE_BASE_URL + width;
  }

  // Movie Details
  public static getMovieDetails(movieId: number): string {
    return `movie/${movieId}?api_key=${TMDB.API_KEY}`;
  }

  // TV Show Details
  public static getTvDetails(tvId: number): string {
    return `tv/${tvId}?api_key=${TMDB.API_KEY}`;
  }

  // Episode Images
  public static getEpisodeImages(
    tvId: number,
    seasonNumber: number,
    episodeNumber: number,
  ): string {
    return `tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}/images?api_key=${TMDB.API_KEY}`;
  }

  // Season Details
  public static getSeasonDetails(tvId: number, seasonNumber: number): string {
    return `tv/${tvId}/season/${seasonNumber}?api_key=${TMDB.API_KEY}`;
  }

  // Search (for finding series by name)
  public static searchTvShow(query: string): string {
    return `search/tv?query=${encodeURIComponent(query)}&api_key=${TMDB.API_KEY}`;
  }

  public static searchMovie(query: string): string {
    return `search/movie?query=${encodeURIComponent(query)}&api_key=${TMDB.API_KEY}`;
  }

  // Multi-search (movies, TV shows, people)
  public static multiSearch(query: string): string {
    return `search/multi?query=${encodeURIComponent(query)}&api_key=${TMDB.API_KEY}`;
  }

  // Trending
  public static getTrending(mediaType: string, timeWindow: string): string {
    // mediaType: "all", "movie", "tv", "person"
    // timeWindow: "day", "week"
    return `trending/${mediaType}/${timeWindow}?api_key=${TMDB.API_KEY}`;
  }

  // Popular TV Shows
  public static getPopularTvShows(): string {
    return `tv/popular?api_key=${TMDB.API_KEY}`;
  }

  // Top Rated TV Shows
  public static getTopRatedTvShows(): string {
    return `tv/top_rated?api_key=${TMDB.API_KEY}`;
  }

  // Similar TV Shows
  public static getSimilarTvShows(tvId: number): string {
    return `tv/${tvId}/similar?api_key=${TMDB.API_KEY}`;
  }

  // Recommendations
  public static getRecommendations(tvId: number): string {
    return `tv/${tvId}/recommendations?api_key=${TMDB.API_KEY}`;
  }

  // Releases (General)
  public static getRelease(id: number, type: string): string {
    return `${type}/${id}/release_dates?api_key=${TMDB.API_KEY}`;
  }

  // Credits (Cast & Crew)
  public static getCredits(tvId: number): string {
    return `tv/${tvId}/credits?api_key=${TMDB.API_KEY}`;
  }

  // External IDs (for AniList/MAL/TVDB mapping)
  public static getExternalIds(tvId: number): string {
    return `tv/${tvId}/external_ids?api_key=${TMDB.API_KEY}`;
  }

  // Videos (Trailers, Clips, etc.)
  public static getVideos(tvId: number): string {
    return `tv/${tvId}/videos?api_key=${TMDB.API_KEY}`;
  }

  // Reviews
  public static getReviews(tvId: number): string {
    return `tv/${tvId}/reviews?api_key=${TMDB.API_KEY}`;
  }
}
