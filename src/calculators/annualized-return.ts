import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'annualized-return',
    name: 'Annualized Return Calculator',
    category: 'investing',
    metaTitle: 'Annualized Return Calculator - Compute Annual Rates',
    metaDesc: 'Standardize investment gains of variable durations into equivalent annual compounding percentages.',
    primaryKeyword: 'Annualized Return Calculator',
    formulaName: 'Annualized Return Formula',
    formulaDesc: 'AR = [(Final Value / Initial Value)^(1 / Years) - 1] × 100',
    explanation: 'Converts absolute multi-year investment profits into a normalized annual interest return, facilitating precise product comparisons.',
    example: 'A portfolio expanding from $10,000 to $18,000 over 5.5 years represents an annualized return rate of 11.23%.',
    relatedSlugs: ['roi', 'cagr', 'index-fund'],
    fields: [
      { key: 'initialValue', label: 'Initial Principal Base', type: 'number', defaultValue: 10000, isCurrency: true },
      { key: 'finalValue', label: 'Final Asset Balance', type: 'number', defaultValue: 18000, isCurrency: true },
      { key: 'yearsHeld', label: 'Holding Duration (Years)', type: 'number', defaultValue: 5.5, min: 0.1, max: 40, step: 0.1 }
    ],
    faqs: [
      { question: 'Why use Annualized Return over simple ROI?', answer: 'Simple ROI can be misleading. A 100% return sounds elite, but if it took 25 years to achieve, the annualized return is only 2.8%, losing to standard inflation.' },
      { question: 'What is the formula difference with CAGR?', answer: 'For single initial lump-sum assets, Annualized Return and CAGR are mathematically identical.' }
    ],
    calculate: (inputs, currency) => {
      const initial = inputs.initialValue || 1;
      const final = inputs.finalValue || 0;
      const y = inputs.yearsHeld || 5.5;
      const ar = (Math.pow(final / initial, 1 / y) - 1) * 100;
      const chartData = Array.from({ length: Math.ceil(y) }, (_, idx) => ({
        year: `Yr ${idx + 1}`,
        balance: Math.round(initial * Math.pow(1 + ar / 100, Math.min(idx + 1, y)))
      }));
      return {
        metrics: [
          { label: 'Annualized Return Rate (AR)', value: ar.toFixed(2) + '%', isPrimary: true, desc: 'Equivalent yearly interest' },
          { label: 'Absolute Growth Yield', value: final - initial, desc: 'Profits earned in currency' }
        ],
        chartData,
        explanationText: `Your asset expanded at a compound annual speed of ${ar.toFixed(2)}% over the ${y}-year holding period.`
      };
    }
  };
