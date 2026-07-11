import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'retirement',
    name: 'Retirement Calculator',
    category: 'retirement',
    metaTitle: 'Retirement Calculator - Model Your Long-Term Nest Egg',
    metaDesc: 'Calculate the size of the retirement fund required to maintain your living standards during your post-work years.',
    primaryKeyword: 'Retirement Calculator',
    formulaName: 'Compound Interest with Regular Savings',
    formulaDesc: 'Future Nest Egg = P × (1+r)^t + PMT × [((1+r)^t - 1) / r] × (1+r).',
    explanation: 'A classic, versatile retirement planner focusing on standard age buckets, accumulated portfolios, regular monthly investment streams, and asset yield compounding.',
    example: 'Starting with $50,000 at age 30 and adding $500 monthly for 30 years at 8% yield produces a retirement nest egg of approximately $1,215,100 by age 60.',
    relatedSlugs: ['financial-freedom', 'retirement-income', 'inflation', 'safe-withdrawal'],
    fields: [
      { key: 'currentAge', label: 'Current Age', type: 'number', defaultValue: 30, min: 15, max: 75 },
      { key: 'retireAge', label: 'Target Retirement Age', type: 'number', defaultValue: 60, min: 40, max: 85 },
      { key: 'currentSavings', label: 'Current Savings Portfolio', type: 'number', defaultValue: 50000, isCurrency: true },
      { key: 'monthlyInvest', label: 'Monthly Contributions', type: 'number', defaultValue: 500, isCurrency: true },
      { key: 'expectedReturn', label: 'Expected Yield (%)', type: 'number', defaultValue: 8, isPercent: true },
    ],
    faqs: [
      { question: 'When is the best time to start saving for retirement?', answer: 'Immediately. Due to compounding interest, saving small sums in your twenties or thirties often creates a vastly larger nest egg than trying to catch up in your fifties.' },
      { question: 'What is a typical retirement target age?', answer: 'The standard target ranges from 60 to 65 years, though FIRE practitioners aim for ages 35 to 55.' }
    ],
    calculate: (inputs, currency) => {
      const curAge = inputs.currentAge || 30;
      const retAge = inputs.retireAge || 60;
      const sav = inputs.currentSavings || 0;
      const inv = inputs.monthlyInvest || 0;
      const ret = (inputs.expectedReturn || 8) / 100;

      const yearsToRetire = Math.max(1, retAge - curAge);
      let totalWealth = sav;
      const chartData = [];

      for (let y = 1; y <= yearsToRetire; y++) {
        for (let m = 0; m < 12; m++) {
          totalWealth = totalWealth * (1 + ret / 12) + inv;
        }
        chartData.push({
          year: `Yr ${y}`,
          age: curAge + y,
          wealth: Math.round(totalWealth),
        });
      }

      return {
        metrics: [
          { label: 'Portfolio at Retirement', value: totalWealth, isPrimary: true, desc: 'Accumulated wealth at retirement age' },
          { label: 'Years to Save', value: `${yearsToRetire} years`, desc: 'Active accumulation window remaining' },
          { label: 'Total Capital Contributed', value: sav + inv * 12 * yearsToRetire, desc: 'Sum of your active manual savings' },
        ],
        chartData,
        explanationText: `Your regular contributions and compounded interest are projected to compile a total nest egg of ${totalWealth.toLocaleString()} at age ${retAge}.`
      };
    }
  };
