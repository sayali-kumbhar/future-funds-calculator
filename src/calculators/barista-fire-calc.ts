import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'barista-fire-calc',
    name: 'Barista FIRE Calculator',
    category: 'fire',
    metaTitle: 'Barista FIRE Calculator - Part-Time Retirement',
    metaDesc: 'Plan early retirement supported by part-time or low-stress work covering minor active expenses.',
    primaryKeyword: 'Barista FIRE Calculator',
    formulaName: 'Part-Time Income Asset Support',
    formulaDesc: 'Corpus Required = (Annual Expenses - Part-Time Income) × 25',
    explanation: 'Models transitioning to a low-stress, enjoyable job that covers a slice of your bills, drastically lowering your retirement savings target.',
    example: 'To cover $40,000 in expenses with a $15,000 barista income, you only need a nest egg of $625,000.',
    relatedSlugs: ['fire', 'coast-fire-calc', 'lean-fire-calc'],
    fields: [
      { key: 'currentAge', label: 'Current Age', type: 'number', defaultValue: 32, min: 18, max: 60 },
      { key: 'annualExpenses', label: 'Expected Annual Expenses', type: 'number', defaultValue: 45000, isCurrency: true },
      { key: 'partTimeIncome', label: 'Assumed Part-Time Annual Income', type: 'number', defaultValue: 18000, isCurrency: true },
      { key: 'monthlySaves', label: 'Monthly Savings Today', type: 'number', defaultValue: 1800, isCurrency: true },
      { key: 'growthRate', label: 'Expected Growth Rate (%)', type: 'number', defaultValue: 8, isPercent: true }
    ],
    faqs: [
      { question: 'What is Barista FIRE?', answer: 'Retiring early from corporate stress, but working a low-intensity job for pocket money, healthcare benefits, or social interaction.' },
      { question: 'What is the main risk of Barista FIRE?', answer: 'Overestimating long-term part-time wages or running into physical health limitations that restrict part-time work capabilities.' }
    ],
    calculate: (inputs, currency) => {
      const curAge = inputs.currentAge || 32;
      const exp = inputs.annualExpenses || 45000;
      const part = inputs.partTimeIncome || 18000;
      const sav = inputs.monthlySaves || 1800;
      const r = (inputs.growthRate || 8) / 100 / 12;
      const gap = Math.max(0, exp - part);
      const target = gap * 25;
      let balance = 0;
      let yearsToTarget = -1;
      const chartData = [];
      for (let y = 1; y <= 40; y++) {
        for (let m = 0; m < 12; m++) {
          balance = balance * (1 + r) + sav;
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
          { label: 'Barista FIRE Target Corpus', value: target, isPrimary: true, desc: 'Corpus needed supporting part-time income' },
          { label: 'Years to Barista Freedom', value: yearsToTarget !== -1 ? `${yearsToTarget} years` : '40+ years', desc: 'Timeline to switch' }
        ],
        chartData,
        explanationText: yearsToTarget !== -1
          ? `Terrific! You can transition to Barista retirement in ${yearsToTarget} years at age ${curAge + yearsToTarget} with a target corpus of ${target.toLocaleString()}.`
          : `At your current savings speed, reaching Barista FIRE will take over 40 years. Consider increasing current savings.`
      };
    }
  };
