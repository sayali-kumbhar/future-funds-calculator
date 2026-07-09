import { useApp } from '../context/AppContext';

export function useCurrency() {
  const { currency, setCurrency, country, setCountry, formatCurrency, convertValue } = useApp();
  return {
    currency,
    setCurrency,
    country,
    setCountry,
    formatCurrency,
    convertValue,
  };
}
