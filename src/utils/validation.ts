/**
 * Standard client side validation utility.
 */
export function validateNumberInput(
  value: number,
  min: number = 0,
  max: number = Infinity,
  fieldName: string = 'Value'
): string | null {
  if (isNaN(value)) {
    return `${fieldName} must be a valid number`;
  }
  if (value < min) {
    return `${fieldName} cannot be less than ${min}`;
  }
  if (value > max) {
    return `${fieldName} cannot exceed ${max}`;
  }
  return null;
}
