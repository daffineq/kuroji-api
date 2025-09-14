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

export { parseNumber, parseBoolean };
