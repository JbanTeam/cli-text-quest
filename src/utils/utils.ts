export function lastElemOfArr<T>(arr: T[]): T {
  if (!Array.isArray(arr)) throw new Error('Not an array');

  if (arr.length === 0) throw new Error('Array is empty');

  return arr[arr.length - 1];
}
