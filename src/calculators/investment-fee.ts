import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'investment-fee',
    name: 'Investment Fee Impact Calculator',
    category: 'investing',
    metaTitle: 'Investment Fee Calculator - Check Fee Leaks',
    metaDesc: 'Discover how annual wealth advisory fees, wrap fees, and trading commissions eat up to 30% of your long-term retirement capital.',
    primaryKeyword: 'Investment Fee Calculator',
    formulaName: 'Fee Erosion Equation',
    formulaDesc: 'Fee Cost = [Compounded Gross Value] - [Compounded Net Value]',
    explanation: 'Models how seemingly minor yearly fees erode massive portions of your final wealth over a 30-year horizon.',
    example: 'An annual fee of 1.5% on a $50,000 starting portfolio growing at 9% for 30 years drains a staggering $204,000 in compound growth.',
    relatedSlugs: ['expense-ratio-calc', 'index-fund', 'portfolio-growth'],
    fields: [
      { key: 'portfolioBase', label: 'Starting Investment Balance', type: 'number', defaultValue: 50000, isCurrency: true },
      { key: 'annualSip', label: 'Annual Contributions', type: 'number', defaultValue: 5000, isCurrency: true },
      { key: 'grossYield', label: 'Gross Market Return (%)', type: 'number', defaultValue: 9.5, isPercent: true },
      { key: 'advisorFee', label: 'Annual Fees / Expense Ratio (%)', type: 'number', defaultValue: 1.5, isPercent: true, step: 0.1 },
      { key: 'years', label: 'Compounding Horizon (Years)', type: 'number', defaultValue: 30, min: 5, max: 40 }
    ],
    faqs: [
      { question: 'What are active mutual fund expense ratios?', answer: 'Typically between 1% and 2.5%. Index funds charge under 0.2%, leaving much more cash in your portfolio to compound.' },
      { question: 'Why does a 1.5% fee cost so much over 30 years?', answer: 'Because the fees are deducted every year. You lose not only the cash paid but all the compounding growth that cash would have generated.' }
    ],
    calculate: (inputs, currency) => {
      const start = inputs.portfolioBase || 0;
      const add = inputs.annualSip || 0;
      const grw = (inputs.grossYield || 9.5) / 100;
      const fee = (inputs.advisorFee || 1.5) / 100;
      const years = inputs.years || 30;
      const feePercent = inputs.advisorFee !== undefined ? inputs.advisorFee : 1.5;
      let balanceGross = start;
      let balanceNet = start;
      const chartData = [];
      for (let y = 1; y <= years; y++) {
        balanceGross = balanceGross * (1 + grw) + add;
        balanceNet = balanceNet * (1 + Math.max(0, grw - fee)) + add;
        chartData.push({
          year: `Yr ${y}`,
          grossValue: Math.round(balanceGross),
          netValue: Math.round(balanceNet),
          feesLost: Math.max(0, Math.round(balanceGross - balanceNet))
        });
      }
      const percentDrained = balanceGross > 0 ? Math.max(0, (1 - balanceNet / balanceGross) * 100).toFixed(1) : '0.0';
      return {
        metrics: [
          { label: 'Lost to Fees & Expenses', value: Math.max(0, Math.round(balanceGross - balanceNet)), isPrimary: true, desc: 'Total compounding wealth drained' },
          { label: 'Net Keepable Portfolio', value: Math.round(balanceNet), desc: 'Your remaining wealth' },
          { label: 'Percentage Drained', value: percentDrained + '%', desc: 'Ratio of final wealth taken by fees' }
        ],
        chartData,
        explanationText: balanceGross > 0
          ? `Over ${years} years, a ${feePercent}% annual fee drains ${Math.max(0, Math.round(balanceGross - balanceNet)).toLocaleString()}, capturing ${percentDrained}% of your potential net worth.`
          : `Enter your starting portfolio balance and annual contributions to analyze the fee erosion over ${years} years.`
      };
    }
  };
