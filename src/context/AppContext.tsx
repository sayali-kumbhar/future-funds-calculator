import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Page } from '../types';
import { SUPPORTED_CURRENCIES, SUPPORTED_COUNTRIES, formatCurrencyValue, convertCurrency } from '../data/currenciesData';

interface AppContextType {
  currentPage: Page | 'calculators' | 'ai-blueprint';
  setCurrentPage: (page: Page | 'calculators' | 'ai-blueprint') => void;
  selectedCalculatorSlug: string | null;
  setSelectedCalculatorSlug: (slug: string | null) => void;
  currency: string;
  setCurrency: (code: string) => void;
  country: string;
  setCountry: (code: string) => void;
  formatCurrency: (value: number) => string;
  convertValue: (value: number, fromCurrency: string) => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page | 'calculators' | 'ai-blueprint'>('home');
  const [selectedCalculatorSlug, setSelectedCalculatorSlug] = useState<string | null>(null);
  
  const [currency, setCurrencyState] = useState<string>('USD');
  const [country, setCountryState] = useState<string>('GLOBAL');

  // Load state from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem('future_fund_currency');
    const savedCountry = localStorage.getItem('future_fund_country');
    if (savedCurrency) {
      setCurrencyState(savedCurrency);
    } else {
      // Avoid India default bias
      setCurrencyState('USD');
    }
    if (savedCountry) {
      setCountryState(savedCountry);
    }
  }, []);

  const setCurrency = (code: string) => {
    if (SUPPORTED_CURRENCIES[code]) {
      setCurrencyState(code);
      localStorage.setItem('future_fund_currency', code);
    }
  };

  const setCountry = (code: string) => {
    const countryConfig = SUPPORTED_COUNTRIES.find(c => c.code === code);
    if (countryConfig) {
      setCountryState(code);
      localStorage.setItem('future_fund_country', code);
      // Auto-update currency to the country's default currency
      setCurrency(countryConfig.defaultCurrency);
    }
  };

  const formatCurrency = (value: number) => {
    return formatCurrencyValue(value, currency);
  };

  const convertValue = (value: number, fromCurrency: string) => {
    return convertCurrency(value, fromCurrency, currency);
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedCalculatorSlug,
        setSelectedCalculatorSlug,
        currency,
        setCurrency,
        country,
        setCountry,
        formatCurrency,
        convertValue,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
