export type Select = {
  [key: string]: true | Select;
};

export function toPrismaSelect(obj: Select): any {
  const res: any = {};
  for (const key in obj) {
    const val = obj[key];
    if (val === true) {
      res[key] = true;
    } else if (typeof val === 'object') {
      res[key] = { select: toPrismaSelect(val) };
    }
  }
  return res;
}
