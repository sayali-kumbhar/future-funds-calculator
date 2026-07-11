import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'coast-fire-calc',
    name: 'Coast FIRE Calculator',
    category: 'fire',
    metaTitle: 'Coast FIRE Calculator - Stop Saving Early',
    metaDesc: 'Discover your Coast FIRE number. Front-load your retirement savings early so you can stop active contributions and let compounding do the rest.',
    primaryKeyword: 'Coast FIRE Calculator',
    formulaName: 'Coast FIRE Equation',
    formulaDesc: 'Coast Nest Egg = Target Corpus / (1 + r)^t',
    explanation: 'Calculates the age at which your existing savings base is large enough to grow into your retirement goal on its own, allowing you to stop active saving.',
    example: 'A 30-year-old with $150,000 already saved needs zero additional savings to reach a $1,000,000 retirement goal at age 60 under standard market growth.',
    relatedSlugs: ['fire', 'lean-fire-calc', 'barista-fire'],
    fields: [
      { key: 'currentAge', label: 'Current Age', type: 'number', defaultValue: 30, min: 18, max: 60 },
      { key: 'targetAge', label: 'Retirement Target Age', type: 'number', defaultValue: 60, min: 40, max: 70 },
      { key: 'currentInvested', label: 'Current Invested Balance', type: 'number', defaultValue: 100000, isCurrency: true },
      { key: 'annualExpenses', label: 'Expected Annual Expenses', type: 'number', defaultValue: 40000, isCurrency: true },
      { key: 'growthRate', label: 'Expected Growth Rate (%)', type: 'number', defaultValue: 8, isPercent: true }
    ],
    faqs: [
      { question: 'What is Coast FIRE?', answer: 'A strategic milestone where your existing nest egg is large enough that you do not need to save another dollar before retirement. You only earn enough to cover current living expenses.' },
      { question: 'Does Coast FIRE allow me to quit working?', answer: 'No. You must still work or earn to cover your active monthly bills, but you can choose lower-stress or lower-paying work since you do not need to save for retirement.' }
    ],
    calculate: (inputs, currency) => {
      const curAge = inputs.currentAge || 30;
      const targetAge = inputs.targetAge || 60;
      const current = inputs.currentInvested || 100000;
      const exp = inputs.annualExpenses || 40000;
      const r = (inputs.growthRate || 8) / 100;
      const targetCorpus = exp * 25;
      const yearsRemaining = targetAge - curAge;
      const coastRequired = targetCorpus / Math.pow(1 + r, yearsRemaining);
      const chartData = [];
      let balance = current;
      for (let y = 1; y <= yearsRemaining; y++) {
        balance *= (1 + r);
        chartData.push({
          year: `Age ${curAge + y}`,
          balance: Math.round(balance),
          coastRequired: Math.round(targetCorpus / Math.pow(1 + r, yearsRemaining - y))
        });
      }
      return {
        metrics: [
          { label: 'Coast FIRE Number Required', value: coastRequired, isPrimary: true, desc: 'What you need today to stop saving' },
          { label: 'Target Retirement Corpus', value: targetCorpus, desc: 'Your retirement nest egg goal' },
          { label: 'Your Current Status', value: current >= coastRequired ? 'Coast FIRE Achieved!' : 'Accumulating', desc: 'Status based on current assets' }
        ],
        chartData,
        explanationText: current >= coastRequired
          ? `Excellent! You have achieved Coast FIRE! Your current ${current.toLocaleString()} will compounding grow into your retirement goal of ${targetCorpus.toLocaleString()} on its own by age ${targetAge}.`
          : `You are on your way. You need another ${(coastRequired - current).toLocaleString()} to reach your Coast FIRE number. keep saving!`
      };
    }
  };
