import { CurrencyConfig, CountryConfig } from '../types/currency';

export const SUPPORTED_CURRENCIES: Record<string, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', rate: 1.0, label: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92, label: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', rate: 0.79, label: 'British Pound' },
  INR: { code: 'INR', symbol: '₹', rate: 83.5, label: 'Indian Rupee' },
  CAD: { code: 'CAD', symbol: 'C$', rate: 1.36, label: 'Canadian Dollar' },
  AUD: { code: 'AUD', symbol: 'A$', rate: 1.51, label: 'Australian Dollar' },
  SGD: { code: 'SGD', symbol: 'S$', rate: 1.35, label: 'Singapore Dollar' },
  AED: { code: 'AED', symbol: 'د.إ', rate: 3.67, label: 'UAE Dirham' },
  JPY: { code: 'JPY', symbol: '¥', rate: 158.0, label: 'Japanese Yen' },
  CHF: { code: 'CHF', symbol: 'CHF', rate: 0.89, label: 'Swiss Franc' },
};

export const SUPPORTED_COUNTRIES: CountryConfig[] = [
  { code: 'GLOBAL', name: 'Global (No specific country)', defaultCurrency: 'USD', flag: '🌐' },
  { code: 'US', name: 'United States', defaultCurrency: 'USD', flag: '🇺🇸' },
  { code: 'DE', name: 'Germany', defaultCurrency: 'EUR', flag: '🇩🇪' },
  { code: 'GB', name: 'United Kingdom', defaultCurrency: 'GBP', flag: '🇬🇧' },
  { code: 'IN', name: 'India', defaultCurrency: 'INR', flag: '🇮🇳' },
  { code: 'CA', name: 'Canada', defaultCurrency: 'CAD', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', defaultCurrency: 'AUD', flag: '🇦🇺' },
  { code: 'SG', name: 'Singapore', defaultCurrency: 'SGD', flag: '🇸🇬' },
  { code: 'AE', name: 'United Arab Emirates', defaultCurrency: 'AED', flag: '🇦🇪' },
  { code: 'JP', name: 'Japan', defaultCurrency: 'JPY', flag: '🇯🇵' },
  { code: 'CH', name: 'Switzerland', defaultCurrency: 'CHF', flag: '🇨🇭' },
];
