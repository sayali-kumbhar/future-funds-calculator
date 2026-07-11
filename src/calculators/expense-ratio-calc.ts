import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'expense-ratio-calc',
    name: 'Expense Ratio Calculator',
    category: 'investing',
    metaTitle: 'Expense Ratio Calculator - Mutual Fund Fee Impact',
    metaDesc: 'Compare how different mutual fund and ETF expense ratios drain long-term asset compound gains.',
    primaryKeyword: 'Expense Ratio Calculator',
    formulaName: 'Expense Fee Cost Equation',
    formulaDesc: 'Fee Drag = Gross Portfolio - Net Portfolio',
    explanation: 'Deconstructs the drag of mutual fund and ETF expense ratios on systematic investment plans.',
    example: 'An expensive regular mutual fund charging a 1.8% fee costs $56,000 more than a direct plan charging 0.2% over 25 years.',
    relatedSlugs: ['investment-fee', 'index-fund', 'compound-interest'],
    fields: [
      { key: 'monthlySip', label: 'Monthly SIP Amount', type: 'number', defaultValue: 500, isCurrency: true },
      { key: 'marketYield', label: 'Market Yield Rate (%)', type: 'number', defaultValue: 10, isPercent: true },
      { key: 'expenseRatio', label: 'Fund Expense Ratio (%)', type: 'number', defaultValue: 1.75, isPercent: true, step: 0.1 },
      { key: 'years', label: 'Timeline in Years', type: 'number', defaultValue: 25, min: 5, max: 40 }
    ],
    faqs: [
      { question: 'What is a cheap index expense ratio?', answer: 'Generally under 0.20%. Any expense ratio above 1% is expensive and should be avoided for index-tracking portfolios.' },
      { question: 'What are direct plans vs regular plans?', answer: 'Direct plans are purchased directly from the fund provider, eliminating agent commission fees and cutting expense ratios by up to 1.5%.' }
    ],
    calculate: (inputs, currency) => {
      const pmt = inputs.monthlySip || 0;
      const t = inputs.years || 25;
      const rGross = (inputs.marketYield || 10) / 100 / 12;
      const rNet = ((inputs.marketYield || 10) - (inputs.expenseRatio || 1.75)) / 100 / 12;
      let balanceGross = 0;
      let balanceNet = 0;
      const chartData = [];
      for (let y = 1; y <= t; y++) {
        for (let m = 0; m < 12; m++) {
          balanceGross = balanceGross * (1 + rGross) + pmt;
          balanceNet = balanceNet * (1 + rNet) + pmt;
        }
        chartData.push({
          year: `Yr ${y}`,
          withLowFees: Math.round(balanceGross),
          withHighFees: Math.round(balanceNet)
        });
      }
      return {
        metrics: [
          { label: 'Lost to Fund Expenses', value: balanceGross - balanceNet, isPrimary: true, desc: 'Wealth eaten by distributor fees' },
          { label: 'Net Fund Balance', value: balanceNet, desc: 'Your final capital' },
          { label: 'Total Gross Value', value: balanceGross, desc: 'Value if zero-fee index was used' }
        ],
        chartData,
        explanationText: `Your ${inputs.expenseRatio}% fund fee strips away ${Math.round(balanceGross - balanceNet).toLocaleString()} in compound interest over ${t} years. Switching to direct plans helps save this.`
      };
    }
  };
