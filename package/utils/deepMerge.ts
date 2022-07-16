const isObject = (val: any) => val && typeof val === 'object';
const mergeArrayWithDedupe = (a: any[], b: any[]) =>
  Array.from(new Set([...a, ...b]));

export const deepMerge = <T>(
  target: Record<string, any>,
  obj: Record<string, any>,
  exclude?: string[]
) => {
  for (const key of Object.keys(obj)) {
    const oldVal = target[key];
    const newVal = obj[key];
    if (exclude && exclude.includes(key)) {
      target[key] = newVal;
    } else {
      if (Array.isArray(oldVal) && Array.isArray(newVal)) {
        target[key] = mergeArrayWithDedupe(oldVal, newVal);
      } else if (isObject(oldVal) && isObject(newVal)) {
        target[key] = deepMerge(oldVal, newVal);
      } else {
        target[key] = newVal;
      }
    }
  }

  return target as T;
};
