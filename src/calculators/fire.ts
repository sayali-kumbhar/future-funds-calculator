import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'fire',
    name: 'FIRE Calculator (Standard)',
    category: 'fire',
    metaTitle: 'FIRE Calculator - Plan Your Early Retirement Goals',
    metaDesc: 'Design your custom FIRE strategy. Calculate target savings sizes and projection graphs for the classic early retirement pathways.',
    primaryKeyword: 'FIRE Calculator',
    formulaName: 'The FIRE Accumulation Ratio',
    formulaDesc: 'Accumulation Speed = Savings Rate × Investment Compound Curve.',
    explanation: 'The classic Financial Independence, Retire Early (FIRE) planner that maps out standard wealth accumulation curves under a regular safe withdrawal rate.',
    example: 'A 30-year-old starting with zero savings, who saves 50% of a $6,000 monthly income at a 9% return rate, hits FIRE by age 47.',
    relatedSlugs: ['financial-freedom', 'coast-fire', 'lean-fire', 'fat-fire'],
    fields: [
      { key: 'netIncome', label: 'Net Annual Income', type: 'number', defaultValue: 75000, isCurrency: true },
      { key: 'savingsRate', label: 'Savings Rate (%)', type: 'number', defaultValue: 40, min: 5, max: 90, step: 5, isPercent: true },
      { key: 'currentPortfolio', label: 'Current Invested Portfolio', type: 'number', defaultValue: 25000, isCurrency: true },
      { key: 'expectedYield', label: 'Expected Return Rate (%)', type: 'number', defaultValue: 8, isPercent: true },
      { key: 'swr', label: 'Preferred SWR (%)', type: 'number', defaultValue: 4, min: 2, max: 6, step: 0.25, isPercent: true },
    ],
    faqs: [
      { question: 'What is a typical FIRE savings rate?', answer: 'Standard retirement savings suggest 10% to 15%. In the FIRE movement, savers actively strive for 40% to 70%+ of net post-tax earnings to compress retirement timelines down to 10-15 years.' },
      { question: 'Is SWR inflation adjusted?', answer: 'Yes. Safe withdrawal theories assume that in Year 1 you withdraw your chosen SWR (e.g., 4%), and in subsequent years you increase that dollar amount by the actual inflation rate, keeping purchasing power stable.' }
    ],
    calculate: (inputs, currency) => {
      const inc = inputs.netIncome || 75000;
      const sRate = (inputs.savingsRate || 40) / 100;
      const current = inputs.currentPortfolio || 25000;
      const rate = (inputs.expectedYield || 8) / 100;
      const swr = (inputs.swr || 4) / 100;

      const annualExpenses = inc * (1 - sRate);
      const targetCorpus = annualExpenses / swr;
      const annualSavings = inc * sRate;

      let portfolio = current;
      let yearsToFire = -1;
      const chartData = [];

      for (let y = 1; y <= 40; y++) {
        portfolio = portfolio * (1 + rate) + annualSavings;
        chartData.push({
          year: `Yr ${y}`,
          portfolio: Math.round(portfolio),
          target: Math.round(targetCorpus),
        });

        if (yearsToFire === -1 && portfolio >= targetCorpus) {
          yearsToFire = y;
        }
      }

      return {
        metrics: [
          { label: 'Target Corpus', value: targetCorpus, isPrimary: true, desc: 'Nest egg required at chosen SWR' },
          { label: 'Years to Target', value: yearsToFire !== -1 ? `${yearsToFire} years` : '40+ years', desc: 'Timeline to complete accumulation' },
          { label: 'Annual Passive Income', value: targetCorpus * swr, desc: 'Sustainable annual cash flow' },
        ],
        chartData,
        explanationText: `Your target FIRE corpus is ${targetCorpus.toLocaleString()}. At your current annual savings momentum, you will hit this milestone in ${yearsToFire !== -1 ? yearsToFire : '40+'} years.`
      };
    }
  };
