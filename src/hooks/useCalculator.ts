import { useState, useEffect } from 'react';
import { useCurrency } from './useCurrency';

export function useCalculator(
  calculateFn: (inputs: Record<string, any>, currencyCode: string) => any,
  defaultInputs: Record<string, any>
) {
  const { currency } = useCurrency();
  const [inputs, setInputs] = useState<Record<string, any>>(defaultInputs);
  const [outputs, setOutputs] = useState<any>(null);

  useEffect(() => {
    try {
      const results = calculateFn(inputs, currency);
      setOutputs(results);
    } catch (e) {
      console.error('Calculation error:', e);
    }
  }, [inputs, currency, calculateFn]);

  const updateInput = (key: string, value: any) => {
    setInputs(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return {
    inputs,
    updateInput,
    outputs,
    currency,
  };
}
