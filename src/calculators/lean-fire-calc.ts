import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'lean-fire-calc',
    name: 'Lean FIRE Calculator',
    category: 'fire',
    metaTitle: 'Lean FIRE Calculator - Minimalist Retirement Planning',
    metaDesc: 'Plan early retirement based on a minimalist lifestyle with annual expenses lower than regional averages.',
    primaryKeyword: 'Lean FIRE Calculator',
    formulaName: 'Minimalist Nest Egg Calculation',
    formulaDesc: 'Lean FIRE Corpus = Lean Annual Expenses × 25',
    explanation: 'Models early retirement timelines based on optimized expenses and minimalist living standards, enabling you to retire years earlier than average.',
    example: 'An annual expense of $24,000 translates to a Lean FIRE target corpus of $600,000.',
    relatedSlugs: ['fire', 'fat-fire', 'barista-fire'],
    fields: [
      { key: 'currentAge', label: 'Current Age', type: 'number', defaultValue: 28, min: 18, max: 60 },
      { key: 'leanExpenses', label: 'Lean Annual Expenses', type: 'number', defaultValue: 24000, isCurrency: true },
      { key: 'monthlySaves', label: 'Monthly Investment Addition', type: 'number', defaultValue: 1500, isCurrency: true },
      { key: 'expectedYield', label: 'Expected Return Rate (%)', type: 'number', defaultValue: 8.5, isPercent: true }
    ],
    faqs: [
      { question: 'What characterizes Lean FIRE?', answer: 'Retiring early on a minimalist budget, usually covering basic needs like housing, groceries, and insurance with very little luxury overhead.' },
      { question: 'How can I transition out of Lean FIRE later?', answer: 'You can launch a low-stress side hustle or shift to part-time work to slowly grow your fund toward Standard FIRE levels.' }
    ],
    calculate: (inputs, currency) => {
      const curAge = inputs.currentAge || 28;
      const exp = inputs.leanExpenses || 24000;
      const sav = inputs.monthlySaves || 1500;
      const ret = (inputs.expectedYield || 8.5) / 100 / 12;
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
          { label: 'Lean FIRE Nest Egg Target', value: target, isPrimary: true, desc: 'Target corpus' },
          { label: 'Estimated Lean FIRE Age', value: yearsToTarget !== -1 ? `${curAge + yearsToTarget} years old` : '40+ years', desc: 'When you can achieve Lean retirement' }
        ],
        chartData,
        explanationText: yearsToTarget !== -1
          ? `Incredible! Your minimalist retirement target of ${target.toLocaleString()} can be reached in ${yearsToTarget} years at age ${curAge + yearsToTarget}.`
          : `At your current savings rate, it will take more than 40 years to reach Lean FIRE. Try increasing your savings rate.`
      };
    }
  };
