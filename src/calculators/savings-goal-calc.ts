import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'savings-goal-calc',
    name: 'Savings Goal Plan Calculator',
    category: 'savings_budget',
    metaTitle: 'Savings Goal Calculator - Track Personal Savings',
    metaDesc: 'Discover exactly how much cash to save monthly to achieve your next purchase goal.',
    primaryKeyword: 'Savings Goal Calculator',
    formulaName: 'Sinking Savings Target',
    formulaDesc: 'Monthly Deposit = Goal Target / Months',
    explanation: 'Reverse-calculates your monthly cash contribution needed to secure an upcoming purchase goal.',
    example: 'To buy a $12,000 asset in 18 months, you need to save $667 monthly.',
    relatedSlugs: ['savings-calc', 'vacation-savings', 'wedding-savings'],
    fields: [
      { key: 'goalAmount', label: 'Goal Purchase Target', type: 'number', defaultValue: 12000, isCurrency: true },
      { key: 'monthsToGoal', label: 'Timeline in Months', type: 'number', defaultValue: 18, min: 1, max: 60 }
    ],
    faqs: [
      { question: 'What is a sinking savings pot?', answer: 'A designated separate account where you pool cash to fund a specific purchase without disrupting your main investment strategy.' },
      { question: 'Should sinking pots be invested in stocks?', answer: 'No. Goals under 2 years should remain in liquid cash or short-term deposits to protect principal from market swings.' }
    ],
    calculate: (inputs, currency) => {
      const target = inputs.goalAmount || 12000;
      const m = inputs.monthsToGoal || 18;
      const monthlySaves = target / m;
      const chartData = Array.from({ length: Math.ceil(m / 3) }, (_, i) => ({
        month: `Mo ${(i + 1) * 3}`,
        balance: Math.round(Math.min(target, monthlySaves * (i + 1) * 3)),
        target
      }));
      return {
        metrics: [
          { label: 'Required Monthly Savings', value: monthlySaves, isPrimary: true, desc: 'What you need to save each month' },
          { label: 'Total Saved After Timeline', value: target, desc: 'Sum compiled on finish' }
        ],
        chartData,
        explanationText: `To harvest ${target.toLocaleString()} in ${m} months, you must save ${Math.round(monthlySaves).toLocaleString()} per month.`
      };
    }
  };
