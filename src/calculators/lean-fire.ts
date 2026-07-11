import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'lean-fire',
    name: 'Lean FIRE Calculator',
    category: 'fire',
    metaTitle: 'Lean FIRE Calculator - Minimalism & Frugal Independence',
    metaDesc: 'Plan your minimalist early retirement. Estimate your lean nest egg targets based on cost containment, low overheads, and index returns.',
    primaryKeyword: 'Lean FIRE Calculator',
    formulaName: 'Lean Retirement Nest Egg',
    formulaDesc: 'Lean Nest Egg = Lean Annual Expenses × 25.',
    explanation: 'Lean FIRE is tailored for individuals pursuing minimalist lifestyles, self-sustainability, and ultra-frugal expenditure models, lowering the required nest egg significantly.',
    example: 'By keeping annual expenses to a lean $24,000, you only require a portfolio of $600,000 to retire early (instead of $1M+ for standard paths).',
    relatedSlugs: ['fire', 'fat-fire', 'barista-fire', 'budget'],
    fields: [
      { key: 'leanExpenses', label: 'Lean Annual Expenses', type: 'number', defaultValue: 24000, isCurrency: true },
      { key: 'savingsRate', label: 'Current Savings Portfolio', type: 'number', defaultValue: 50000, isCurrency: true },
      { key: 'annualInvestment', label: 'Annual Systematic Savings', type: 'number', defaultValue: 12000, isCurrency: true },
      { key: 'expectedReturn', label: 'Expected Return (%)', type: 'number', defaultValue: 9, isPercent: true },
    ],
    faqs: [
      { question: 'What is Lean FIRE?', answer: 'It is achieving financial independence with a retirement budget below the average cost of living (typically under $40,000/year for single individuals in developed nations).' },
      { question: 'What are the risks of Lean FIRE?', answer: 'Due to the narrow margin of safety, sudden medical bills, high inflation, or poor stock market sequences can severely test a lean retirement budget.' }
    ],
    calculate: (inputs, currency) => {
      const exp = inputs.leanExpenses || 24000;
      const sav = inputs.savingsRate || 0;
      const inv = inputs.annualInvestment || 0;
      const ret = (inputs.expectedReturn || 9) / 100;

      const target = exp * 25;
      let currentWealth = sav;
      let years = -1;
      const chartData = [];

      for (let y = 1; y <= 35; y++) {
        currentWealth = currentWealth * (1 + ret) + inv;
        chartData.push({
          year: `Yr ${y}`,
          wealth: Math.round(currentWealth),
          target: Math.round(target),
        });
        if (years === -1 && currentWealth >= target) {
          years = y;
        }
      }

      return {
        metrics: [
          { label: 'Lean Target Egg', value: target, isPrimary: true, desc: 'Frugal retirement buffer threshold' },
          { label: 'Years to Complete', value: years !== -1 ? `${years} years` : '35+ years', desc: 'Timeline to retire on a lean budget' },
          { label: 'Safe Monthly Yield', value: (target * 0.04) / 12, desc: 'Monthly cash withdrawal pool' },
        ],
        chartData,
        explanationText: `Your frugal early retirement nest egg of ${target.toLocaleString()} is achievable in ${years !== -1 ? years : '35+'} years under current systematic savings guidelines.`
      };
    }
  };
