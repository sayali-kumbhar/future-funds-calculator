import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'salary-growth',
    name: 'Salary Growth Calculator',
    category: 'savings_budget',
    metaTitle: 'Salary Growth Calculator - Model Career & Income Trajectories',
    metaDesc: 'Examine how career promotions, performance raises, and inflation adjustments grow your salary over long horizons.',
    primaryKeyword: 'Salary Growth Calculator',
    formulaName: 'Income Growth Trajectory Formula',
    formulaDesc: 'Future Salary = Current Salary × (1 + Annual Increase Rate)^Years.',
    explanation: 'Model how your active salary, career upskills, or regular corporate raises grow over time, allowing you to estimate how your savings rate scales.',
    example: 'An initial salary of $80,000 growing at a 5.5% average annual increase expands to $136,650 in 10 years.',
    relatedSlugs: ['budget', 'financial-freedom', 'investment', 'savings-goal'],
    fields: [
      { key: 'currentSalary', label: 'Current Annual Salary', type: 'number', defaultValue: 80000, isCurrency: true },
      { key: 'annualRaise', label: 'Expected Annual Raise (%)', type: 'number', defaultValue: 5.5, isPercent: true },
      { key: 'years', label: 'Timeline in Years', type: 'number', defaultValue: 10, min: 1, max: 30 },
    ],
    faqs: [
      { question: 'Why model income growth?', answer: 'Income expansion is the single fastest way to pull forward your financial freedom date. Lowering expenses has a floor (you must eat), but your earning potential is unlimited.' },
      { question: 'What is a typical corporate raise?', answer: 'The baseline raise is usually 3% to 4% for inflation, while promotions, certifications, or changing employers can generate 15% to 30%+ jumps.' }
    ],
    calculate: (inputs, currency) => {
      const sal = inputs.currentSalary || 80000;
      const rate = (inputs.annualRaise || 5.5) / 100;
      const t = inputs.years || 10;

      const futureSalary = sal * Math.pow(1 + rate, t);
      const chartData = [];
      for (let i = 1; i <= t; i++) {
        chartData.push({
          year: `Yr ${i}`,
          salary: Math.round(sal * Math.pow(1 + rate, i)),
        });
      }

      return {
        metrics: [
          { label: 'Future Annual Salary', value: futureSalary, isPrimary: true, desc: `Your salary in ${t} years` },
          { label: 'Cumulative Earnings', value: (sal * (Math.pow(1 + rate, t) - 1)) / rate, desc: 'Total earnings over timeline' },
          { label: 'Absolute Growth Jump', value: futureSalary - sal, desc: 'Growth increase' },
        ],
        chartData,
        explanationText: `Your annual salary will scale to ${futureSalary.toLocaleString()} in ${t} years, expanding your lifetime earning capacity.`
      };
    }
  };
