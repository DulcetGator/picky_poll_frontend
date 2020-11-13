export function shallowArrayEq<T>(a: T[], b: T[]) {
  return a.length === b.length
    && a.every((a1, i) => a1 === b[i]);
}
