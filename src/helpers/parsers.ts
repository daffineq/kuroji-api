import { ReleaseDate } from 'src/core/types';

const parseString = (value: unknown): string | undefined => {
  if (value == null) {
    return undefined;
  }
  const string_ = String(value);
  return string_.length > 0 ? string_ : undefined;
};

const parseNumber = (value: unknown): number | undefined => {
  if (value == null) {
    return undefined;
  }
  const number_ = Number(value);
  return Number.isNaN(number_) ? undefined : number_;
};

const parseBoolean = (value: unknown): boolean | undefined => {
  if (value == null) {
    return undefined;
  }
  const boolean_ = Boolean(value);
  return boolean_ === true || boolean_ === false ? boolean_ : undefined;
};

const parseReleaseDate = (date: { year: number; month: number; day: number }): ReleaseDate => {
  return {
    year: date.year,
    month: date.month,
    day: date.day
  };
};

export { parseString, parseNumber, parseBoolean, parseReleaseDate };
