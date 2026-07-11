import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'cagr-calc',
    name: 'CAGR Calculator',
    category: 'investing',
    metaTitle: 'CAGR Calculator - Compound Annual Growth Rate',
    metaDesc: 'Calculate the smooth annual growth rate of an investment from its initial value to its ending balance.',
    primaryKeyword: 'CAGR Calculator',
    formulaName: 'CAGR Formula',
    formulaDesc: 'CAGR = (Ending / Beginning)^(1/t) - 1',
    explanation: 'Computes the geometric compound annual growth speed, smoothing out year-to-year stock market volatility.',
    example: 'Investing $10,000 in a fund that grows to $25,000 over 8 years yields a CAGR of 12.14%.',
    relatedSlugs: ['annualized-return', 'roi', 'portfolio-growth'],
    fields: [
      { key: 'beginningValue', label: 'Beginning Portfolio Value', type: 'number', defaultValue: 10000, isCurrency: true },
      { key: 'endingValue', label: 'Ending Portfolio Value', type: 'number', defaultValue: 25000, isCurrency: true },
      { key: 'years', label: 'Time Horizon (Years)', type: 'number', defaultValue: 8, min: 1, max: 40 }
    ],
    faqs: [
      { question: 'What does CAGR reveal?', answer: 'CAGR represents the imaginary constant interest rate that would grow your initial balance to your final balance if it compounding steadily.' },
      { question: 'Does CAGR account for mid-period additions?', answer: 'No. CAGR only evaluates starting and ending balances. For accounts with ongoing deposits, use XIRR (Extended Internal Rate of Return).' }
    ],
    calculate: (inputs, currency) => {
      const b = inputs.beginningValue || 1;
      const e = inputs.endingValue || 0;
      const t = inputs.years || 8;
      const cagr = (Math.pow(e / b, 1 / t) - 1) * 100;
      const chartData = Array.from({ length: t }, (_, idx) => ({
        year: `Yr ${idx + 1}`,
        balance: Math.round(b * Math.pow(1 + cagr / 100, idx + 1))
      }));
      return {
        metrics: [
          { label: 'CAGR (Growth Speed)', value: cagr.toFixed(2) + '%', isPrimary: true, desc: 'Compound annual growth rate' },
          { label: 'Absolute Cash Created', value: e - b, desc: 'Gain size' }
        ],
        chartData,
        explanationText: `Your capital progressed at a steady geometric CAGR speed of ${cagr.toFixed(2)}% annually over ${t} years.`
      };
    }
  };
