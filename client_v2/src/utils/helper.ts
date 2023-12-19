/**
 * Normalizes value to range of 0 to 100.
 * @param {number} value - value between the MIN and MAX.
 * @param {number} MIN - Minimum value of the range.
 * @param {number} MAX - Maximum value of the range.
 * @returns {number} - Normalized value.
 */
export function normalize (value: number, MIN: number, MAX: number): number {
  let fixedValue = value
  if (value > MAX) fixedValue = MAX
  if (value < MIN) fixedValue = MIN
  return ((fixedValue - MIN) * 100) / (MAX - MIN)
}
