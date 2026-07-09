export interface CurrencyConfig {
  code: string;
  symbol: string;
  rate: number;
  label: string;
}

export interface CountryConfig {
  code: string;
  name: string;
  defaultCurrency: string;
  flag: string;
}
