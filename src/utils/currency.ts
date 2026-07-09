import { SUPPORTED_CURRENCIES } from '../constants/currencies';

/**
 * Format a numeric currency value according to the target currency config.
 */
export function formatCurrencyValue(value: number, currencyCode: string): string {
  const config = SUPPORTED_CURRENCIES[currencyCode] || SUPPORTED_CURRENCIES.USD;
  const locale = currencyCode === 'INR' ? 'en-IN' : 'en-US';

  // Custom shorthand for Indian Rupees (Lakh/Crore) if requested or high value
  if (currencyCode === 'INR') {
    if (value >= 10000000) {
      return `${config.symbol}${(value / 10000000).toFixed(2)} Cr`;
    }
    if (value >= 100000) {
      return `${config.symbol}${(value / 100000).toFixed(2)} Lakh`;
    }
  } else {
    // Standard Million/Thousand shorthand for other currencies
    if (value >= 1000000) {
      return `${config.symbol}${(value / 1000000).toFixed(2)}M`;
    }
    if (value >= 1000) {
      return `${config.symbol}${(value / 1000).toFixed(0)}K`;
    }
  }

  return `${config.symbol}${Math.round(value).toLocaleString(locale)}`;
}

/**
 * Helper to convert currency values between two currencies
 */
export function convertCurrency(value: number, from: string, to: string): number {
  const fromConfig = SUPPORTED_CURRENCIES[from] || SUPPORTED_CURRENCIES.USD;
  const toConfig = SUPPORTED_CURRENCIES[to] || SUPPORTED_CURRENCIES.USD;
  
  // Convert to USD first, then to target currency
  const valueInUSD = value / fromConfig.rate;
  return valueInUSD * toConfig.rate;
}
