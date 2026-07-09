/**
 * Formats a number to a fixed decimal string or local currency style.
 */
export function formatNumber(val: number, decimals: number = 0): string {
  return val.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Formats a decimal percentage to percentage string (e.g., 0.085 -> "8.5%")
 */
export function formatPercent(val: number): string {
  return `${(val * 100).toFixed(1)}%`;
}

/**
 * Capitalizes the first letter of each word in a string.
 */
export function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}
