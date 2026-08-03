import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'investment',
    name: 'Investment Calculator',
    category: 'investing',
    metaTitle: 'Investment Calculator - Map Out Portfolio Projections',
    metaDesc: 'Simulate financial portfolio return rates over long-term timelines to structure custom asset goals.',
    primaryKeyword: 'Investment Calculator',
    formulaName: 'Investment Growth Modeling',
    formulaDesc: 'Portfolio Value = Principal × (1 + Return Rate)^t.',
    explanation: 'A general-purpose investment planning layout for examining how lump sums grow over time under variable interest returns.',
    example: 'A $25,000 index fund bundle growing at an 11% average annual yield expands to $148,450 over a 17-year timeline.',
    relatedSlugs: ['compound-interest', 'investment-return', 'future-value', 'portfolio-allocation'],
    fields: [
      { key: 'lumpSum', label: 'Initial Lump Sum', type: 'number', defaultValue: 25000, isCurrency: true },
      { key: 'annualAdd', label: 'Annual Contributions', type: 'number', defaultValue: 5000, isCurrency: true },
      { key: 'years', label: 'Investment Horizon (Years)', type: 'number', defaultValue: 20, min: 1, max: 40 },
      { key: 'returnRate', label: 'Expected Yield (%)', type: 'number', defaultValue: 9.5, isPercent: true },
    ],
    faqs: [
      { question: 'How does a finance calculator investment tool simulate wealth growth?', answer: 'A finance calculator investment tool takes your initial principal, ongoing recurring contributions, expected yield (e.g. 8-12%), and duration in years to chart compound wealth expansion and principal growth over time.' },
      { question: 'How does FutureFund compare to a physical Casio financial calculator (FC-200V / FC-100V)?', answer: 'Unlike physical Casio TVM calculators that require complex button combinations and mono LCD displays, FutureFund provides an intuitive visual web interface with real-time interactive charts, annual growth tables, and multi-currency formatting.' },
      { question: 'What expected return should I model?', answer: 'US and Indian broad-market indexes have historically achieved 10% to 13% average annual returns before inflation over multi-decade periods.' },
      { question: 'How do index funds simplify investing?', answer: 'They bundle hundreds of top companies into a single cheap basket, providing automatic diversification and matching overall market momentum.' }
    ],
    calculate: (inputs, currency) => {
      const lump = inputs.lumpSum || 0;
      const add = inputs.annualAdd || 0;
      const t = inputs.years || 20;
      const r = (inputs.returnRate || 9.5) / 100;

      let portfolio = lump;
      let contributions = lump;
      const chartData = [];

      for (let y = 1; y <= t; y++) {
        portfolio = portfolio * (1 + r) + add;
        contributions += add;
        chartData.push({
          year: `Yr ${y}`,
          portfolio: Math.round(portfolio),
          contributions: Math.round(contributions),
        });
      }

      return {
        metrics: [
          { label: 'Projected Portfolio', value: portfolio, isPrimary: true, desc: 'Compounded asset total' },
          { label: 'Your Active Capital', value: contributions, desc: 'Lump sum plus annual deposits' },
          { label: 'Total Growth Yield', value: Math.max(0, portfolio - contributions), desc: 'Market compound gains' },
        ],
        chartData,
        explanationText: `Sustaining your regular allocation yields a future investment bundle of ${portfolio.toLocaleString()} in ${t} years.`
      };
    }
  };
