import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'fire',
    name: 'FIRE Calculator (Standard)',
    category: 'fire',
    metaTitle: 'FIRE Calculator: Early Retirement Target & SWR Timeline [2026]',
    metaDesc: 'Calculate your Financial Independence Retire Early (FIRE) number, Coast FIRE, Lean FIRE, and safe withdrawal rate timeline with interactive charts.',
    primaryKeyword: 'FIRE Calculator',
    formulaName: 'The FIRE Accumulation Ratio & 25x Rule',
    formulaDesc: 'FIRE Number = Annual Expenses × (1 / Safe Withdrawal Rate) = Annual Expenses × 25 (at 4% SWR)',
    explanation: 'The classic Financial Independence, Retire Early (FIRE) planner that maps out standard wealth accumulation curves under a regular safe withdrawal rate.',
    example: 'With $40,000 in annual living expenses, a 4% Safe Withdrawal Rate mandates a target nest egg of $1,000,000. Saving 50% of an $80,000 salary at 8% returns hits this target in ~16.5 years.',
    relatedSlugs: ['financial-freedom', 'coast-fire', 'lean-fire', 'fat-fire', 'barista-fire'],
    fields: [
      { key: 'netIncome', label: 'Net Annual Income', type: 'number', defaultValue: 75000, isCurrency: true },
      { key: 'savingsRate', label: 'Savings Rate (%)', type: 'number', defaultValue: 40, min: 5, max: 90, step: 5, isPercent: true },
      { key: 'currentPortfolio', label: 'Current Invested Portfolio', type: 'number', defaultValue: 25000, isCurrency: true },
      { key: 'expectedYield', label: 'Expected Return Rate (%)', type: 'number', defaultValue: 8, isPercent: true },
      { key: 'swr', label: 'Preferred SWR (%)', type: 'number', defaultValue: 4, min: 2, max: 6, step: 0.25, isPercent: true },
    ],
    faqs: [
      { question: 'What is the 4% Rule and is it safe for a 40-year early retirement?', answer: 'The Trinity Study established that a 4% initial withdrawal adjusted annually for inflation survived 30-year retirements. For longer 40-50 year FIRE horizons, many financial planners recommend a more conservative 3.25% - 3.5% SWR.' },
      { question: 'What is the fastest way to accelerate FIRE timelines?', answer: 'Increasing your savings rate from 20% to 50%+ has a dual effect: it drastically speeds up wealth accumulation while simultaneously reducing the annual expenditure your future portfolio must support.' },
      { question: 'What is the difference between Lean FIRE, Coast FIRE, and Fat FIRE?', answer: 'Lean FIRE targets minimal living expenses (<$40k/yr), Coast FIRE means saving enough early so compound growth hits your goal without extra contributions, and Fat FIRE supports an abundant luxury lifestyle ($100k-$200k+/yr).' }
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
