export const graphql = (strings: TemplateStringsArray, ...values: any[]) =>
  strings.reduce((result, string, i) => result + string + (values[i] || ''), '');
