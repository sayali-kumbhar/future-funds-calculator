import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'fat-fire',
    name: 'Fat FIRE Calculator',
    category: 'fire',
    metaTitle: 'Fat FIRE Calculator - Plan a Luxury Early Retirement',
    metaDesc: 'Estimate the target portfolio needed to sustain a premium, high-spend lifestyle in early retirement without active income.',
    primaryKeyword: 'Fat FIRE Calculator',
    formulaName: 'Fat FIRE Multiplier Formula',
    formulaDesc: 'Required Nest Egg = Luxury Annual Expenses × 25 (or custom SWR ratio).',
    explanation: 'Fat FIRE is designed for individuals who wish to maintain an abundant, high-spend, or luxurious lifestyle (frequent luxury travel, fine dining, upscale housing) in early retirement.',
    example: 'If your luxury annual budget is $150,000, you require a robust portfolio of $3,750,000 under the 4% safe withdrawal rule.',
    relatedSlugs: ['fire', 'lean-fire', 'barista-fire', 'safe-withdrawal'],
    fields: [
      { key: 'fatExpenses', label: 'Luxury Annual Expenses', type: 'number', defaultValue: 120000, isCurrency: true },
      { key: 'swr', label: 'Safe Withdrawal Rate (%)', type: 'number', defaultValue: 3.5, min: 2, max: 5, step: 0.1, isPercent: true },
      { key: 'currentSavings', label: 'Current Savings Portfolio', type: 'number', defaultValue: 250000, isCurrency: true },
      { key: 'annualSavings', label: 'Annual Capital Savings', type: 'number', defaultValue: 50000, isCurrency: true },
      { key: 'expectedReturn', label: 'Expected Yield (%)', type: 'number', defaultValue: 8, isPercent: true },
    ],
    faqs: [
      { question: 'What is Fat FIRE?', answer: 'It is early retirement with an annual budget significantly exceeding the median household income (typically $100,000+ per year in developed countries).' },
      { question: 'Why do Fat FIRE practitioners use a lower SWR?', answer: 'To protect massive wealth portfolios from market drawdowns, many affluent retirees prefer a 3% or 3.25% SWR for permanent safety buffers.' }
    ],
    calculate: (inputs, currency) => {
      const exp = inputs.fatExpenses || 120000;
      const swr = (inputs.swr || 3.5) / 100;
      const sav = inputs.currentSavings || 0;
      const inv = inputs.annualSavings || 0;
      const ret = (inputs.expectedReturn || 8) / 100;

      const target = exp / swr;
      let currentWealth = sav;
      let years = -1;
      const chartData = [];

      for (let y = 1; y <= 40; y++) {
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
          { label: 'Fat Target Egg', value: target, isPrimary: true, desc: 'Luxury retirement fund needed' },
          { label: 'Years Remaining', value: years !== -1 ? `${years} years` : '40+ years', desc: 'Time to accumulate your premium corpus' },
          { label: 'Safe Monthly Outflow', value: (target * swr) / 12, desc: 'Monthly passive spend allowance' },
        ],
        chartData,
        explanationText: `Sustaining an affluent lifestyle requires a robust compound asset base. Your Fat FIRE target of ${target.toLocaleString()} is projected to clear in ${years !== -1 ? years : '40+'} years.`
      };
    }
  };
