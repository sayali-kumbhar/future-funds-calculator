import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'expense-ratio',
    name: 'Expense Ratio Calculator',
    category: 'investing',
    metaTitle: 'Expense Ratio Calculator - Audit Mutual Fund Cost Drag',
    metaDesc: 'Examine how fund management fees and expense ratios drag down your portfolio worth over long horizons.',
    primaryKeyword: 'Expense Ratio Calculator',
    formulaName: 'Annual Fee Impact Formula',
    formulaDesc: 'Portfolio Outflow = Average Balance × Expense Ratio (%).',
    explanation: 'Calculates the long-term impact of asset management fees (expense ratios) on your investment returns. Even minor fee differences (e.g., 0.1% vs 1.2%) can consume hundreds of thousands of dollars over decades.',
    example: 'Investing $100,000 for 30 years at 9% return with a 0.1% expense ratio yields $1,283,299. If the fee is 1.25%, your final balance drops to $915,227—costing you $368,072 in lost gains.',
    relatedSlugs: ['compound-interest', 'investment', 'withdrawal-rate', 'present-value'],
    fields: [
      { key: 'portfolioSize', label: 'Starting Portfolio Size', type: 'number', defaultValue: 100000, isCurrency: true },
      { key: 'annualContribution', label: 'Annual Savings Contribution', type: 'number', defaultValue: 10000, isCurrency: true },
      { key: 'years', label: 'Timeline in Years', type: 'number', defaultValue: 25, min: 1, max: 40 },
      { key: 'expectedReturn', label: 'Expected Gross Return (%)', type: 'number', defaultValue: 9, isPercent: true },
      { key: 'expenseRatio', label: 'Fund Expense Ratio (%)', type: 'number', defaultValue: 1.15, min: 0.05, max: 3, step: 0.05, isPercent: true },
    ],
    faqs: [
      { question: 'What is a mutual fund Expense Ratio?', answer: 'An annual fee charged by mutual funds or ETFs to cover portfolio management, administration, and marketing, expressed as a percentage of your total asset balance.' },
      { question: 'What is a cheap expense ratio?', answer: 'Broad market index funds from providers like Vanguard, Fidelity, or top Indian AMC index plans usually cost between 0.03% and 0.20% per year.' }
    ],
    calculate: (inputs, currency) => {
      const p = inputs.portfolioSize || 100000;
      const add = inputs.annualContribution || 10000;
      const t = inputs.years || 25;
      const gross = (inputs.expectedReturn || 9) / 100;
      const fee = (inputs.expenseRatio || 1.15) / 100;

      const netReturn = gross - fee;

      let pGross = p;
      let pNet = p;
      const chartData = [];

      for (let y = 1; y <= t; y++) {
        pGross = pGross * (1 + gross) + add;
        pNet = pNet * (1 + netReturn) + add;
        chartData.push({
          year: `Yr ${y}`,
          grossValue: Math.round(pGross),
          netValue: Math.round(pNet),
        });
      }

      const totalFeesPaid = pGross - pNet;

      return {
        metrics: [
          { label: 'Lost to Management Fees', value: totalFeesPaid, isPrimary: true, desc: 'Compounded fee drag cost' },
          { label: 'Fund Balance (Net of Fees)', value: pNet, desc: 'What you keep' },
          { label: 'Full Balance (No Fees)', value: pGross, desc: 'Ideal fee-free balance' },
        ],
        chartData,
        explanationText: `A management fee of ${inputs.expenseRatio}% drags your final balance down by ${totalFeesPaid.toLocaleString()} over ${t} years, consuming ${Math.round((totalFeesPaid/pGross)*100)}% of your potential gross portfolio value.`
      };
    }
  };
