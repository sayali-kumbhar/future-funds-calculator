import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'annual-investment',
    name: 'Annual Investment Calculator',
    category: 'investing',
    metaTitle: 'Annual Investment Calculator - Annual Systematic Deposits',
    metaDesc: 'Project wealth growth of year-end or year-beginning annual lumpsum contributions compounding long-term.',
    primaryKeyword: 'Annual Investment Calculator',
    formulaName: 'Future Value of Ordinary Annuity',
    formulaDesc: 'FV = PMT × [((1 + r)^t - 1) / r]',
    explanation: 'Models large annual systematic contributions (such as tax-savings allowances or annual bonuses) compounding over multi-decade periods.',
    example: 'An annual deposit of $6,000 in a public pension fund yielding 8% for 25 years compounds into a secure nest egg of $438,630.',
    relatedSlugs: ['monthly-investment', 'savings-goal', 'compound-interest'],
    fields: [
      { key: 'annualAdd', label: 'Annual Contribution', type: 'number', defaultValue: 6000, isCurrency: true },
      { key: 'interestRate', label: 'Expected Return Rate (%)', type: 'number', defaultValue: 8, isPercent: true },
      { key: 'years', label: 'Horizon in Years', type: 'number', defaultValue: 25, min: 1, max: 40 }
    ],
    faqs: [
      { question: 'When is annual investing ideal?', answer: 'When you receive seasonal business payouts, annual corporate bonuses, or wish to fill tax-saving accounts early in the fiscal year.' },
      { question: 'Does year-start differ from year-end deposits?', answer: 'Yes! Depositing at the start of the year allows cash an extra 12 months of compounding growth compared to year-end allocations.' }
    ],
    calculate: (inputs, currency) => {
      const pmt = inputs.annualAdd || 0;
      const r = (inputs.interestRate || 8) / 100;
      const t = inputs.years || 25;
      let balance = 0;
      let contributions = 0;
      const chartData = [];
      for (let y = 1; y <= t; y++) {
        balance = (balance + pmt) * (1 + r);
        contributions += pmt;
        chartData.push({
          year: `Yr ${y}`,
          balance: Math.round(balance),
          contributions: Math.round(contributions)
        });
      }
      return {
        metrics: [
          { label: 'Future Value Accumulated', value: balance, isPrimary: true, desc: 'Fully compounded balance' },
          { label: 'Principal Allocated', value: contributions, desc: 'Sum of annual deposits' }
        ],
        chartData,
        explanationText: `By adding ${pmt.toLocaleString()} annually, you assemble a total corpus of ${Math.round(balance).toLocaleString()} over ${t} years.`
      };
    }
  };
