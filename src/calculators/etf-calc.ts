import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'etf-calc',
    name: 'ETF Growth Calculator',
    category: 'investing',
    metaTitle: 'ETF Calculator - Exchange Traded Fund Planner',
    metaDesc: 'Project compound interest, expense ratio leaks, and dividend growth on Exchange-Traded Funds (ETFs).',
    primaryKeyword: 'ETF Calculator',
    formulaName: 'ETF Accumulation Logic',
    formulaDesc: 'Net Value = [SIP compounded growth] - Expense Ratio Leaks',
    explanation: 'Models long-term wealth building with Exchange Traded Funds, factoring in transaction ease and automatic diversification.',
    example: 'Saving $6,000 annually in an ETF compounding at 9.5% grows to $382,000 over 22 years.',
    relatedSlugs: ['index-fund', 'expense-ratio-calc', 'investment-fee'],
    fields: [
      { key: 'startingBase', label: 'Starting ETF Balance', type: 'number', defaultValue: 10000, isCurrency: true },
      { key: 'monthlyAdd', label: 'Monthly SIP Addition', type: 'number', defaultValue: 400, isCurrency: true },
      { key: 'expectedYield', label: 'Expected Yield (%)', type: 'number', defaultValue: 9.5, isPercent: true },
      { key: 'expenseRatio', label: 'Annual Expense Ratio (%)', type: 'number', defaultValue: 0.15, isPercent: true, step: 0.05 },
      { key: 'years', label: 'Horizon (Years)', type: 'number', defaultValue: 20, min: 1, max: 40 }
    ],
    faqs: [
      { question: 'What is an ETF expense ratio?', answer: 'The annual fee deducted directly by the fund provider to cover operational costs. Low fees are vital—keep ETF expense ratios below 0.3%.' },
      { question: 'How do ETFs differ from Mutual Funds?', answer: 'ETFs trade instantly on stock exchanges like regular shares during market hours, whereas mutual funds process orders only at the end of the day.' }
    ],
    calculate: (inputs, currency) => {
      const base = inputs.startingBase || 0;
      const pmt = inputs.monthlyAdd || 0;
      const yieldRate = inputs.expectedYield || 9.5;
      const exp = inputs.expenseRatio || 0.15;
      const netRate = (yieldRate - exp) / 100 / 12;
      const t = inputs.years || 20;
      let balance = base;
      let contributions = base;
      const chartData = [];
      for (let y = 1; y <= t; y++) {
        for (let m = 0; m < 12; m++) {
          balance = balance * (1 + netRate) + pmt;
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
          { label: 'Future ETF Portfolio Value', value: balance, isPrimary: true, desc: 'Accumulated balance (net of fees)' },
          { label: 'Out-of-Pocket Deposits', value: contributions, desc: 'Sum of starting balance and manual saves' }
        ],
        chartData,
        explanationText: `Your ETF portfolio grows to ${Math.round(balance).toLocaleString()} in ${t} years under a net growth return of ${(yieldRate - exp).toFixed(2)}% per annum.`
      };
    }
  };
