import Config from '../../../../../configs/config.js';
import { MediaSort } from '../../filter/Filter.js';

type FlexibleField = string | number | boolean | object | null | undefined;

export default class AnilistQueryBuilder {
  private variables: { [key: string]: FlexibleField } = {};

  constructor() {
    this.variables.page = Config.DEFAULT_PAGE;
    this.variables.perPage = Config.DEFAULT_PER_PAGE;
  }

  public getByQuery(query: any): this {
    console.log(query);

    // Pagination
    if (query.page) this.setPage(+query.page);
    if (query.perPage) this.setPerPage(+query.perPage);

    // Basic filters
    if (query.search) this.setSearch(query.search);
    if (query.type) this.setType(query.type);
    if (query.status) this.setStatus(query.status);
    if (query.format) this.setFormat(query.format);
    if (query.season) this.setSeason(query.season);
    if (query.isAdult !== undefined) this.setIsAdult(query.isAdult === 'true');
    if (query.isLicensed !== undefined)
      this.setIsLicensed(query.isLicensed === 'true');
    if (query.countryOfOrigin) this.setCountryOfOrigin(query.countryOfOrigin);

    // ID filters
    if (query.id) this.setId(+query.id);
    if (query.idMal) this.setIdMal(+query.idMal);
    if (query.idNot) this.setIdNot(+query.idNot);
    if (query.idIn) this.setIdIn(query.idIn.split(',').map(Number));
    if (query.idNotIn) this.setIdNotIn(query.idNotIn.split(',').map(Number));
    if (query.idMalNot) this.setIdMalNot(+query.idMalNot);
    if (query.idMalIn) this.setIdMalIn(query.idMalIn.split(',').map(Number));
    if (query.idMalNotIn)
      this.setIdMalNotIn(query.idMalNotIn.split(',').map(Number));

    // Date filters
    if (query.startDateGreater)
      this.setStartDateGreater(query.startDateGreater);
    if (query.startDateLesser) this.setStartDateLesser(query.startDateLesser);
    if (query.startDateLike) this.setStartDateLike(query.startDateLike);
    if (query.endDateGreater) this.setEndDateGreater(query.endDateGreater);
    if (query.endDateLesser) this.setEndDateLesser(query.endDateLesser);
    if (query.endDateLike) this.setEndDateLike(query.endDateLike);

    // Format filters
    if (query.formatIn) this.setFormatIn(query.formatIn.split(','));
    if (query.formatNotIn) this.setFormatNotIn(query.formatNotIn.split(','));
    if (query.formatNot) this.setFormatNot(query.formatNot);

    // Status filters
    if (query.statusIn) this.setStatusIn(query.statusIn.split(','));
    if (query.statusNotIn) this.setStatusNotIn(query.statusNotIn.split(','));
    if (query.statusNot) this.setStatusNot(query.statusNot);

    // Episode and duration filters
    if (query.episodesGreater) this.setEpisodesGreater(+query.episodesGreater);
    if (query.episodesLesser) this.setEpisodesLesser(+query.episodesLesser);
    if (query.durationGreater) this.setDurationGreater(+query.durationGreater);
    if (query.durationLesser) this.setDurationLesser(+query.durationLesser);

    // Genre and tag filters
    if (query.genreIn) this.setGenreIn(query.genreIn.split(','));
    if (query.genreNotIn) this.setGenreNotIn(query.genreNotIn.split(','));
    if (query.tagIn) this.setTagIn(query.tagIn.split(','));
    if (query.tagNotIn) this.setTagNotIn(query.tagNotIn.split(','));
    if (query.tagCategoryIn)
      this.setTagCategoryIn(query.tagCategoryIn.split(','));
    if (query.tagCategoryNotIn)
      this.setTagCategoryNotIn(query.tagCategoryNotIn.split(','));

    // License filters
    if (query.licensedByIn) this.setLicensedByIn(query.licensedByIn.split(','));
    if (query.licensedByIdIn)
      this.setLicensedByIdIn(query.licensedByIdIn.split(','));

    // Score and popularity filters
    if (query.averageScoreGreater)
      this.setAverageScoreGreater(+query.averageScoreGreater);
    if (query.averageScoreLesser)
      this.setAverageScoreLesser(+query.averageScoreLesser);
    if (query.averageScoreNot) this.setAverageScoreNot(+query.averageScoreNot);
    if (query.popularityGreater)
      this.setPopularityGreater(+query.popularityGreater);
    if (query.popularityLesser)
      this.setPopularityLesser(+query.popularityLesser);
    if (query.popularityNot) this.setPopularityNot(+query.popularityNot);

    // Source filters
    if (query.sourceIn) this.setSourceIn(query.sourceIn.split(','));

    // Sort
    if (query.sort) {
      const sortArray = query.sort.split(',') as MediaSort[];
      this.setSort(sortArray);
    }

    return this;
  }

  public setSort(sort: MediaSort[] | null): this {
    if (sort !== null) this.variables.sort = sort;
    return this;
  }

  public setPerPage(perPage: number): this {
    if (perPage !== null) this.variables.perPage = perPage;
    return this;
  }

  public setPage(page: number): this {
    if (page !== null) this.variables.page = page;
    return this;
  }

  public setSourceIn(sourceIn: FlexibleField): this {
    if (sourceIn !== null) this.variables.source_in = sourceIn;
    return this;
  }

  public setPopularityLesser(popularityLesser: number): this {
    if (popularityLesser !== null)
      this.variables.popularity_lesser = popularityLesser;
    return this;
  }

  public setPopularityGreater(popularityGreater: number): this {
    if (popularityGreater !== null)
      this.variables.popularity_greater = popularityGreater;
    return this;
  }

  public setPopularityNot(popularityNot: number): this {
    if (popularityNot !== null) this.variables.popularity_not = popularityNot;
    return this;
  }

  public setAverageScoreLesser(averageScoreLesser: number): this {
    if (averageScoreLesser !== null)
      this.variables.averageScore_lesser = averageScoreLesser;
    return this;
  }

  public setAverageScoreGreater(averageScoreGreater: number): this {
    if (averageScoreGreater !== null)
      this.variables.averageScore_greater = averageScoreGreater;
    return this;
  }

  public setAverageScoreNot(averageScoreNot: number): this {
    if (averageScoreNot !== null)
      this.variables.averageScore_not = averageScoreNot;
    return this;
  }

  public setLicensedByIdIn(licensedByIdIn: FlexibleField): this {
    if (licensedByIdIn !== null)
      this.variables.licensedById_in = licensedByIdIn;
    return this;
  }

  public setLicensedByIn(licensedByIn: FlexibleField): this {
    if (licensedByIn !== null) this.variables.licensedBy_in = licensedByIn;
    return this;
  }

  public setTagCategoryNotIn(tagCategoryNotIn: FlexibleField): this {
    if (tagCategoryNotIn !== null)
      this.variables.tagCategory_not_in = tagCategoryNotIn;
    return this;
  }

  public setTagCategoryIn(tagCategoryIn: FlexibleField): this {
    if (tagCategoryIn !== null) this.variables.tagCategory_in = tagCategoryIn;
    return this;
  }

  public setTagNotIn(tagNotIn: FlexibleField): this {
    if (tagNotIn !== null) this.variables.tag_not_in = tagNotIn;
    return this;
  }

  public setTagIn(tagIn: FlexibleField): this {
    if (tagIn !== null) this.variables.tag_in = tagIn;
    return this;
  }

  public setGenreNotIn(genreNotIn: FlexibleField): this {
    if (genreNotIn !== null) this.variables.genre_not_in = genreNotIn;
    return this;
  }

  public setGenreIn(genreIn: FlexibleField): this {
    if (genreIn !== null) this.variables.genre_in = genreIn;
    return this;
  }

  public setDurationLesser(durationLesser: number): this {
    if (durationLesser !== null)
      this.variables.duration_lesser = durationLesser;
    return this;
  }

  public setDurationGreater(durationGreater: number): this {
    if (durationGreater !== null)
      this.variables.duration_greater = durationGreater;
    return this;
  }

  public setEpisodesLesser(episodesLesser: number): this {
    if (episodesLesser !== null)
      this.variables.episodes_lesser = episodesLesser;
    return this;
  }

  public setEpisodesGreater(episodesGreater: number): this {
    if (episodesGreater !== null)
      this.variables.episodes_greater = episodesGreater;
    return this;
  }

  public setStatusNotIn(statusNotIn: FlexibleField): this {
    if (statusNotIn !== null) this.variables.status_not_in = statusNotIn;
    return this;
  }

  public setStatusNot(statusNot: FlexibleField): this {
    if (statusNot !== null) this.variables.status_not = statusNot;
    return this;
  }

  public setStatusIn(statusIn: FlexibleField): this {
    if (statusIn !== null) this.variables.status_in = statusIn;
    return this;
  }

  public setFormatNotIn(formatNotIn: FlexibleField): this {
    if (formatNotIn !== null) this.variables.format_not_in = formatNotIn;
    return this;
  }

  public setFormatNot(formatNot: FlexibleField): this {
    if (formatNot !== null) this.variables.format_not = formatNot;
    return this;
  }

  public setFormatIn(formatIn: FlexibleField): this {
    if (formatIn !== null) this.variables.format_in = formatIn;
    return this;
  }

  public setEndDateLike(endDateLike: string): this {
    if (endDateLike !== null) this.variables.endDate_like = endDateLike;
    return this;
  }

  public setEndDateLesser(endDateLesser: FlexibleField): this {
    if (endDateLesser !== null) this.variables.endDate_lesser = endDateLesser;
    return this;
  }

  public setEndDateGreater(endDateGreater: FlexibleField): this {
    if (endDateGreater !== null)
      this.variables.endDate_greater = endDateGreater;
    return this;
  }

  public setStartDateLike(startDateLike: string): this {
    if (startDateLike !== null) this.variables.startDate_like = startDateLike;
    return this;
  }

  public setStartDateLesser(startDateLesser: FlexibleField): this {
    if (startDateLesser !== null)
      this.variables.startDate_lesser = startDateLesser;
    return this;
  }

  public setStartDateGreater(startDateGreater: FlexibleField): this {
    if (startDateGreater !== null)
      this.variables.startDate_greater = startDateGreater;
    return this;
  }

  public setIdMalNotIn(idMalNotIn: FlexibleField): this {
    if (idMalNotIn !== null) this.variables.idMal_not_in = idMalNotIn;
    return this;
  }

  public setIdMalIn(idMalIn: FlexibleField): this {
    if (idMalIn !== null) this.variables.idMal_in = idMalIn;
    return this;
  }

  public setIdMalNot(idMalNot: number): this {
    if (idMalNot !== null) this.variables.idMal_not = idMalNot;
    return this;
  }

  public setIdNotIn(idNotIn: FlexibleField): this {
    if (idNotIn !== null) this.variables.id_not_in = idNotIn;
    return this;
  }

  public setIdIn(idIn: FlexibleField): this {
    if (idIn !== null) this.variables.id_in = idIn;
    return this;
  }

  public setIdNot(idNot: number): this {
    if (idNot !== null) this.variables.id_not = idNot;
    return this;
  }

  public setSearch(search: string): this {
    if (search !== null) this.variables.search = search;
    return this;
  }

  public setIsLicensed(isLicensed: boolean): this {
    if (isLicensed !== null) this.variables.isLicensed = isLicensed;
    return this;
  }

  public setCountryOfOrigin(countryOfOrigin: string): this {
    if (countryOfOrigin !== null)
      this.variables.countryOfOrigin = countryOfOrigin;
    return this;
  }

  public setIsAdult(isAdult: boolean): this {
    if (isAdult !== null) this.variables.isAdult = isAdult;
    return this;
  }

  public setFormat(format: FlexibleField): this {
    if (format !== null) this.variables.format = format;
    return this;
  }

  public setType(type: FlexibleField): this {
    if (type !== null) this.variables.type = type;
    return this;
  }

  public setStatus(status: FlexibleField): this {
    if (status !== null) this.variables.status = status;
    return this;
  }

  public setSeason(season: FlexibleField): this {
    if (season !== null) this.variables.season = season;
    return this;
  }

  public setId(mediaId: number): this {
    if (mediaId !== null) this.variables.id = mediaId;
    return this;
  }

  public setIdMal(idMal: number): this {
    if (idMal !== null) this.variables.idMal = idMal;
    return this;
  }

  public buildMedia(): { [key: string]: FlexibleField } {
    const mediaVariables = { ...this.variables };
    delete mediaVariables.page;
    delete mediaVariables.perPage;
    return mediaVariables;
  }

  public build(): { [key: string]: FlexibleField } {
    return this.variables;
  }
}
