import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'dividend-calc',
    name: 'Dividend Calculator',
    category: 'investing',
    metaTitle: 'Dividend Calculator - Project Cash Payouts',
    metaDesc: 'Project steady cash flows and dividend payouts of equity holdings based on share count and yields.',
    primaryKeyword: 'Dividend Calculator',
    formulaName: 'Dividend Payment Formula',
    formulaDesc: 'Annual Income = Shares Owned × Dividend Per Share',
    explanation: 'Models monthly or annual dividend distributions from stable cash-generating companies.',
    example: 'Owning 1,000 shares of a stock priced at $50 yielding a 4% dividend creates $2,000 in passive annual cash flow.',
    relatedSlugs: ['dividend-yield', 'drip', 'passive-income'],
    fields: [
      { key: 'portfolioValue', label: 'Total Invested Capital', type: 'number', defaultValue: 50000, isCurrency: true },
      { key: 'dividendYield', label: 'Blended Dividend Yield (%)', type: 'number', defaultValue: 3.5, isPercent: true },
      { key: 'annualGrowth', label: 'Dividend Growth Rate (%)', type: 'number', defaultValue: 5, isPercent: true },
      { key: 'years', label: 'Timeline in Years', type: 'number', defaultValue: 10, min: 1, max: 30 }
    ],
    faqs: [
      { question: 'What is dividend growth rate?', answer: 'The percentage rate at which a company expands its cash distributions year-over-year, protecting your income stream from inflation.' },
      { question: 'Are dividend yields guaranteed?', answer: 'No. Companies can slash or eliminate dividend payouts during financial distress.' }
    ],
    calculate: (inputs, currency) => {
      const cap = inputs.portfolioValue || 0;
      const yld = (inputs.dividendYield || 3.5) / 100;
      const grw = (inputs.annualGrowth || 5) / 100;
      const t = inputs.years || 10;
      let annualIncome = cap * yld;
      const chartData = [];
      for (let y = 1; y <= t; y++) {
        chartData.push({
          year: `Yr ${y}`,
          dividendIncome: Math.round(annualIncome),
          portfolioValue: Math.round(cap * Math.pow(1.05, y)) // assume 5% asset appreciation
        });
        annualIncome *= (1 + grw);
      }
      return {
        metrics: [
          { label: 'Year 1 Dividend Income', value: cap * yld, isPrimary: true, desc: 'Passive cash in first 12 months' },
          { label: 'Year ' + t + ' Dividend Income', value: annualIncome, desc: 'Stretched cash flow after growth' }
        ],
        chartData,
        explanationText: `Your initial portfolio is scheduled to yield ${Math.round(cap * yld).toLocaleString()} in Year 1. Dividend appreciation raises this to ${Math.round(annualIncome).toLocaleString()} in Year ${t}.`
      };
    }
  };
