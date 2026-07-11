import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'retirement-income',
    name: 'Retirement Income Calculator',
    category: 'retirement',
    metaTitle: 'Retirement Income Calculator - Project Post-Work Cash Flows',
    metaDesc: 'Determine if your target pension, social programs, and private asset yields will cover your post-retirement budget.',
    primaryKeyword: 'Retirement Income Calculator',
    formulaName: 'Annual Cash Flow Balance Model',
    formulaDesc: 'Net Cash Flow = (Pension + Private Income + Portfolio Outflow) - Desired Expenses.',
    explanation: 'A cash-flow modeling tool that balances your desired retirement cost of living against various incoming streams (dividends, rental yields, annuities, or public benefits).',
    example: 'If your post-retirement living cost is $4,000/mo and you receive $1,500/mo in pension, your portfolio only needs to supply $2,500/mo.',
    relatedSlugs: ['retirement', 'passive-income', 'safe-withdrawal', 'financial-freedom'],
    fields: [
      { key: 'desiredMonthlyExpenses', label: 'Desired Monthly Retirement Spend', type: 'number', defaultValue: 4500, isCurrency: true },
      { key: 'guaranteedIncome', label: 'Social Benefit / Pensions Monthly', type: 'number', defaultValue: 1200, isCurrency: true },
      { key: 'portfolioSize', label: 'Total Retiring Net Portfolio', type: 'number', defaultValue: 800000, isCurrency: true },
      { key: 'withdrawalRate', label: 'Portfolio SWR (%)', type: 'number', defaultValue: 4, isPercent: true },
    ],
    faqs: [
      { question: 'Why factor in social benefits?', answer: 'Social security or company pensions act as a guaranteed cash cushion, reducing the stress on your private stock portfolio and lowering your SWR burden.' },
      { question: 'How is inflation adjusted?', answer: 'Most pensions or annuity options have cost-of-living adjustments (COLA) built-in to preserve purchasing power.' }
    ],
    calculate: (inputs, currency) => {
      const exp = inputs.desiredMonthlyExpenses || 4500;
      const pension = inputs.guaranteedIncome || 1200;
      const size = inputs.portfolioSize || 800000;
      const swr = (inputs.withdrawalRate || 4) / 100;

      const annualPortfolioIncome = size * swr;
      const monthlyPortfolioIncome = annualPortfolioIncome / 12;
      const totalMonthlyIncome = pension + monthlyPortfolioIncome;
      const netSurplus = totalMonthlyIncome - exp;

      const chartData = [
        { name: 'Pension / Annuities', value: pension },
        { name: 'Portfolio Outflow', value: monthlyPortfolioIncome },
      ];

      return {
        metrics: [
          { label: 'Total Monthly Income', value: totalMonthlyIncome, isPrimary: true, desc: 'Annuities + Portfolio outflow' },
          { label: 'Monthly Surplus / Gap', value: netSurplus, desc: 'Positive indicates a safe margin' },
          { label: 'Portfolio Outflow Portion', value: monthlyPortfolioIncome, desc: 'What your portfolio supplies' },
        ],
        chartData,
        explanationText: `Your targeted expenses of ${exp.toLocaleString()}/mo are met by a combination of ${pension.toLocaleString()}/mo in pensions and ${monthlyPortfolioIncome.toLocaleString()}/mo in portfolio withdrawals, leaving a net monthly ${netSurplus >= 0 ? 'surplus' : 'deficit'} of ${Math.abs(netSurplus).toLocaleString()}.`
      };
    }
  };
