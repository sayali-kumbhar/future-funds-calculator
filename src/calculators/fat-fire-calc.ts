import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'fat-fire-calc',
    name: 'Fat FIRE Calculator',
    category: 'fire',
    metaTitle: 'Fat FIRE Calculator - Luxury Retirement Planning',
    metaDesc: 'Plan early retirement based on a high-spend, luxury lifestyle with significant active expense buffers.',
    primaryKeyword: 'Fat FIRE Calculator',
    formulaName: 'High-Spend Corpus Calculation',
    formulaDesc: 'Fat FIRE Corpus = Luxury Annual Expenses × 25',
    explanation: 'Models early retirement timelines with high-spend, luxury lifestyle parameters, ensuring you never have to pinch pennies in retirement.',
    example: 'An annual luxury expense profile of $100,000 requires a secure nest egg of $2,500,000.',
    relatedSlugs: ['fire', 'lean-fire-calc', 'coast-fire'],
    fields: [
      { key: 'currentAge', label: 'Current Age', type: 'number', defaultValue: 32, min: 18, max: 60 },
      { key: 'luxuryExpenses', label: 'Luxury Annual Expenses', type: 'number', defaultValue: 100000, isCurrency: true },
      { key: 'monthlySaves', label: 'Monthly Investment Contribution', type: 'number', defaultValue: 5000, isCurrency: true },
      { key: 'expectedYield', label: 'Expected Return Rate (%)', type: 'number', defaultValue: 9, isPercent: true }
    ],
    faqs: [
      { question: 'What defines Fat FIRE?', answer: 'Retiring early with a high lifestyle budget (typically over $100,000/year) to enjoy extensive travel, dining out, premium healthcare, and luxury living.' },
      { question: 'Why does Fat FIRE require an extreme savings rate?', answer: 'To build a multi-million nest egg within a short 10-to-20 year span, you typically must save 50%+ of a high corporate or business income.' }
    ],
    calculate: (inputs, currency) => {
      const curAge = inputs.currentAge || 32;
      const exp = inputs.luxuryExpenses || 100000;
      const sav = inputs.monthlySaves || 5000;
      const ret = (inputs.expectedYield || 9) / 100 / 12;
      const target = exp * 25;
      let balance = 0;
      let yearsToTarget = -1;
      const chartData = [];
      for (let y = 1; y <= 40; y++) {
        for (let m = 0; m < 12; m++) {
          balance = balance * (1 + ret) + sav;
        }
        chartData.push({
          year: `Age ${curAge + y}`,
          balance: Math.round(balance),
          target: Math.round(target)
        });
        if (yearsToTarget === -1 && balance >= target) {
          yearsToTarget = y;
        }
      }
      return {
        metrics: [
          { label: 'Fat FIRE Nest Egg Target', value: target, isPrimary: true, desc: 'Target corpus' },
          { label: 'Estimated Fat FIRE Age', value: yearsToTarget !== -1 ? `${curAge + yearsToTarget} years old` : '40+ years', desc: 'When you can achieve Fat retirement' }
        ],
        chartData,
        explanationText: yearsToTarget !== -1
          ? `Fantastic! You can reach your luxury retirement target of ${target.toLocaleString()} in ${yearsToTarget} years at age ${curAge + yearsToTarget}.`
          : `At your current savings rate, it will take more than 40 years to achieve Fat FIRE. Try boosting income or monthly contributions.`
      };
    }
  };
