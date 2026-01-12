export const uniqueBy = <T, K>(list: T[], key: (item: T) => K): T[] => {
  const seen = new Set<K>();
  return list.filter((item) => {
    const k = key(item);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
};
