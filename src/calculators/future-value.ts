import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'future-value',
    name: 'Future Value Calculator',
    category: 'investing',
    metaTitle: 'Future Value Calculator - Calculate Compounded Worth',
    metaDesc: 'Project the future value of a single initial principal deposit with added continuous compounding yield.',
    primaryKeyword: 'Future Value Calculator',
    formulaName: 'Single Payment Future Value Formula',
    formulaDesc: 'FV = PV × (1 + r)^t.',
    explanation: 'Calculates how much a single lump sum of money invested today will be worth in the future under a constant compounding interest rate.',
    example: 'An initial investment of $10,000 held for 25 years at an 8% compounding yield expands to $68,485.',
    relatedSlugs: ['present-value', 'compound-interest', 'inflation', 'investment-return'],
    fields: [
      { key: 'presentVal', label: 'Present Lump Sum (PV)', type: 'number', defaultValue: 10000, isCurrency: true },
      { key: 'years', label: 'Horizon Timeline (Years)', type: 'number', defaultValue: 25, min: 1, max: 50 },
      { key: 'annualRate', label: 'Annual Compound Interest (%)', type: 'number', defaultValue: 8, isPercent: true },
    ],
    faqs: [
      { question: 'What is the Time Value of Money?', answer: 'The concept that money available today is worth more than the same amount in the future, due to its potential earning capacity.' },
      { question: 'How does tax affect Future Value?', answer: 'Taxes on dividends and capital gains drag down your effective annual returns. Using tax-advantaged retirement accounts can shield your compound gains.' }
    ],
    calculate: (inputs, currency) => {
      const pv = inputs.presentVal || 10000;
      const t = inputs.years || 25;
      const r = (inputs.annualRate || 8) / 100;

      const fv = pv * Math.pow(1 + r, t);
      const chartData = [];
      for (let i = 1; i <= t; i++) {
        chartData.push({
          year: `Yr ${i}`,
          value: Math.round(pv * Math.pow(1 + r, i)),
        });
      }

      return {
        metrics: [
          { label: 'Future Value (FV)', value: fv, isPrimary: true, desc: 'Total compounded value' },
          { label: 'Initial Principal', value: pv, desc: 'Your starting investment' },
          { label: 'Compound Gains', value: fv - pv, desc: 'Interest yield accrued' },
        ],
        chartData,
        explanationText: `Your initial lump sum grows to ${fv.toLocaleString()} over ${t} years under an 8% annual compound model.`
      };
    }
  };
