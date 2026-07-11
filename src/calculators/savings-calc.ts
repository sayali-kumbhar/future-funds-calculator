import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'savings-calc',
    name: 'Savings Growth Estimator',
    category: 'savings_budget',
    metaTitle: 'Savings Growth Calculator - Project Cash Savings',
    metaDesc: 'Project simple compound growth on traditional cash savings accounts and high-yield instruments.',
    primaryKeyword: 'Savings Growth Calculator',
    formulaName: 'Systematic Cash Compounding',
    formulaDesc: 'FV = P × (1+r)^t + PMT × [((1+r)^t - 1)/r]',
    explanation: 'Models saving cash reserves in liquid accounts, demonstrating steady baseline compounding growth.',
    example: 'Depositing $250 monthly in a 4.5% high-yield bank account accumulates $39,200 in 10 years.',
    relatedSlugs: ['savings-goal', 'emergency-fund', 'rainy-day-fund'],
    fields: [
      { key: 'startingBase', label: 'Starting Cash Savings', type: 'number', defaultValue: 5000, isCurrency: true },
      { key: 'monthlyAdd', label: 'Monthly Savings Deposit', type: 'number', defaultValue: 250, isCurrency: true },
      { key: 'yieldRate', label: 'Account Interest Rate (%)', type: 'number', defaultValue: 4.5, isPercent: true },
      { key: 'years', label: 'Horizon in Years', type: 'number', defaultValue: 10, min: 1, max: 20 }
    ],
    faqs: [
      { question: 'What is a High-Yield Savings Account (HYSA)?', answer: 'An account paying significantly higher interest rates than traditional banks (e.g. 4-5% vs 0.1%), accelerating compound savings.' },
      { question: 'Is cash savings vulnerable to inflation?', answer: 'Yes. Liquid savings should be restricted to emergency funds or short-term goals. Long-term wealth should reside in higher-yield equities.' }
    ],
    calculate: (inputs, currency) => {
      const base = inputs.startingBase || 0;
      const pmt = inputs.monthlyAdd || 0;
      const r = (inputs.yieldRate || 4.5) / 100 / 12;
      const t = inputs.years || 10;
      let balance = base;
      let contributions = base;
      const chartData = [];
      for (let y = 1; y <= t; y++) {
        for (let m = 0; m < 12; m++) {
          balance = balance * (1 + r) + pmt;
          contributions += pmt;
        }
        chartData.push({
          year: `Yr ${y}`,
          balance: Math.round(balance),
          contributions: Math.round(contributions)
        });
      }
      return {
        metrics: [
          { label: 'Projected Cash Savings', value: balance, isPrimary: true, desc: 'Accumulated compound balance' },
          { label: 'Out-of-Pocket Savings', value: contributions, desc: 'Sum of manual savings additions' }
        ],
        chartData,
        explanationText: `Your automated monthly cash savings grow to ${Math.round(balance).toLocaleString()} in ${t} years under an interest return of ${inputs.yieldRate}%.`
      };
    }
  };
