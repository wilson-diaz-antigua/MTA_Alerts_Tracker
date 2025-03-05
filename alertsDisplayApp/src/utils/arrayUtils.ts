/**
 * Ensures a value is treated as an array
 * @param value - The value to ensure is an array
 * @returns The value as an array
 */
export function ensureArray<T>(value: T | T[] | null | undefined): T[] {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

/**
 * Creates an array of unique values from a given array
 * @param array - The array to extract unique values from
 * @param mapper - Optional mapping function to apply before deduplication
 * @returns Array of unique values
 */
export function uniqueValues<T, R>(
  array: T[] | T | null | undefined, 
  mapper: (item: T) => R = (item: T) => item as unknown as R
): R[] {
  const safeArray = ensureArray(array);
  return [...new Set(safeArray.map(mapper))];
}
