import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'financial-freedom',
    name: 'Financial Freedom Calculator',
    category: 'fire',
    metaTitle: 'Financial Freedom Calculator - Determine Your Early Retirement Age',
    metaDesc: 'Discover your Financial Freedom Number and age. Test custom investment allocations, annual systematic savings rates, and dividend compounding rules.',
    primaryKeyword: 'Financial Freedom Calculator',
    formulaName: 'The 4% Safe Withdrawal Rule',
    formulaDesc: 'Financial Freedom Target Corpus = Annual Expenses × 25.',
    explanation: 'Calculates the age and nest egg size required to achieve complete financial independence, where you no longer rely on employment income to sustain life.',
    example: 'If your annual expenses are $40,000, your Financial Freedom target is $40,000 × 25 = $1,000,000. At a 5% savings return rate, you could hit this in 20 years by saving $1,500 monthly.',
    relatedSlugs: ['fire', 'coast-fire', 'retirement', 'compound-interest'],
    fields: [
      { key: 'currentAge', label: 'Current Age', type: 'number', defaultValue: 30, min: 15, max: 70 },
      { key: 'monthlyIncome', label: 'Net Monthly Income', type: 'number', defaultValue: 5000, isCurrency: true },
      { key: 'monthlySavings', label: 'Monthly Savings / Investment', type: 'number', defaultValue: 2000, isCurrency: true },
      { key: 'annualExpenses', label: 'Estimated Annual Expenses in Retirement', type: 'number', defaultValue: 40000, isCurrency: true },
      { key: 'investmentReturn', label: 'Assumed Investment Returns (%)', type: 'number', defaultValue: 8.5, isPercent: true },
    ],
    faqs: [
      { question: 'What is the "4% Rule" in early retirement planning?', answer: 'Derived from the historical Trinity Study, it asserts you can safely withdraw 4% of your starting retirement portfolio size in Year 1, and subsequently adjust for inflation, with an extremely low probability of running out of cash over 30 years.' },
      { question: 'How do I raise my Financial Freedom Speed?', answer: 'Two core levers exist: widen your savings margin (by expanding active income or minimizing overheads) and optimize your yield return via diversified equities/SIP accounts.' }
    ],
    calculate: (inputs, currency) => {
      const curAge = inputs.currentAge || 30;
      const inc = inputs.monthlyIncome || 5000;
      const sav = inputs.monthlySavings || 2000;
      const exp = inputs.annualExpenses || 40000;
      const ret = (inputs.investmentReturn || 8.5) / 100;

      const targetCorpus = exp * 25; // Standard 25x rule
      let currentWealth = 0;
      let yearsToFreedom = -1;
      const chartData = [];

      for (let y = 1; y <= 40; y++) {
        for (let m = 0; m < 12; m++) {
          currentWealth = currentWealth * (1 + ret / 12) + sav;
        }
        chartData.push({
          year: `Age ${curAge + y}`,
          wealth: Math.round(currentWealth),
          target: Math.round(targetCorpus),
        });

        if (yearsToFreedom === -1 && currentWealth >= targetCorpus) {
          yearsToFreedom = y;
        }
      }

      const freeAge = yearsToFreedom !== -1 ? curAge + yearsToFreedom : -1;

      return {
        metrics: [
          { label: 'Target Corpus Needed', value: targetCorpus, isPrimary: true, desc: 'Your Financial Freedom Number (25x expenses)' },
          { label: 'Estimated Freedom Age', value: freeAge !== -1 ? `${freeAge} years old` : '40+ years', desc: 'When passive yield exceeds expenses' },
          { label: 'Monthly Saving Momentum', value: sav, desc: 'Your compounding fuel rate' },
        ],
        chartData,
        explanationText: freeAge !== -1 
          ? `Exceptional! You are projected to cross your Financial Freedom line at age ${freeAge}, in ${yearsToFreedom} years, with a secure compounded corpus of ${Math.round(currentWealth).toLocaleString()}.`
          : `Based on your current parameters, achieving your ${targetCorpus.toLocaleString()} goal will take more than 40 years. Try expanding your monthly savings rate or optimizing asset allocation yields.`
      };
    }
  };
