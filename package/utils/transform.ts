export const transformSpecialString = (str: string): string => {
  const code = /[^`]<.{1,}>[^`]/g;
  return str.replaceAll(code, (str) => {
    return `\`${str.trim()}\``;
  });
};
