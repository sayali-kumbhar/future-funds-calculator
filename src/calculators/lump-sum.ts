import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'lump-sum',
    name: 'Lump Sum Investment Calculator',
    category: 'investing',
    metaTitle: 'Lump Sum Investment Calculator - Compound Single Deposits',
    metaDesc: 'Forecast the compounding acceleration of a single lump sum deposit with optional yearly step-up additions.',
    primaryKeyword: 'Lump Sum Investment Calculator',
    formulaName: 'Single Deposit Compound Growth',
    formulaDesc: 'A = P × (1 + r)^t',
    explanation: 'Simulates the growth of a single, one-time investment with zero recurring monthly contributions.',
    example: 'An initial lump sum of $150,000 growing at a 9% return rate over 25 years compounds to a massive $1,293,450.',
    relatedSlugs: ['compound-interest', 'future-value', 'investment'],
    fields: [
      { key: 'lumpSum', label: 'One-Time Lump Sum', type: 'number', defaultValue: 50000, isCurrency: true },
      { key: 'interestRate', label: 'Expected Yield (%)', type: 'number', defaultValue: 9, isPercent: true },
      { key: 'years', label: 'Investment Horizon (Years)', type: 'number', defaultValue: 20, min: 1, max: 50 }
    ],
    faqs: [
      { question: 'Is lump sum better than monthly SIP?', answer: 'Mathematically, lump sum investing outperforms systematic plans roughly 66% of the time because your money has longer exposure to compound returns.' },
      { question: 'How can I limit market timing risk with a lump sum?', answer: 'You can implement a Systematic Transfer Plan (STP), parking the money in liquid funds and shifting equal slices into equities monthly.' }
    ],
    calculate: (inputs, currency) => {
      const p = inputs.lumpSum || 0;
      const r = (inputs.interestRate || 9) / 100;
      const t = inputs.years || 20;
      const balance = p * Math.pow(1 + r, t);
      const chartData = Array.from({ length: t }, (_, i) => ({
        year: `Yr ${i + 1}`,
        balance: Math.round(p * Math.pow(1 + r, i + 1)),
        principal: p
      }));
      return {
        metrics: [
          { label: 'Future Lump Sum Worth', value: balance, isPrimary: true, desc: 'Compounded balance' },
          { label: 'Total Wealth Multiplier', value: (balance / p).toFixed(1) + 'x', desc: 'Ratio of final wealth to initial capital' }
        ],
        chartData,
        explanationText: `Your single deposit of ${p.toLocaleString()} expands ${ (balance/p).toFixed(1) }x over the course of ${t} years.`
      };
    }
  };
