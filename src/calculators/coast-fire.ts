import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'coast-fire',
    name: 'Coast FIRE Calculator',
    category: 'fire',
    metaTitle: 'Coast FIRE Calculator - Calculate Your Passive Compounding Buffer',
    metaDesc: 'Discover your Coast FIRE milestone: the savings size needed today where compounding alone covers standard retirement without further contributions.',
    primaryKeyword: 'Coast FIRE Calculator',
    formulaName: 'Coast FIRE Number Formula',
    formulaDesc: 'Coast FIRE Number = Target Retirement Corpus / (1 + Growth Rate)^(Years to Retirement).',
    explanation: 'Coast FIRE represents having accumulated enough wealth early in life that you no longer need to save another cent to retire comfortably at your target age; you only need to earn enough to cover active living expenses.',
    example: 'If your target corpus is $1,000,000 in 30 years and expected real yield is 5%, you need $1,000,000 / (1.05)^30 = $231,377 today to "coast".',
    relatedSlugs: ['fire', 'lean-fire', 'barista-fire', 'future-value'],
    fields: [
      { key: 'currentAge', label: 'Current Age', type: 'number', defaultValue: 30, min: 15, max: 70 },
      { key: 'retirementAge', label: 'Retirement Age', type: 'number', defaultValue: 60, min: 30, max: 85 },
      { key: 'currentSavings', label: 'Current Savings Portfolio', type: 'number', defaultValue: 75000, isCurrency: true },
      { key: 'annualExpenses', label: 'Annual Expenses in Retirement', type: 'number', defaultValue: 40000, isCurrency: true },
      { key: 'expectedReturn', label: 'Investment Returns Rate (%)', type: 'number', defaultValue: 8, isPercent: true },
      { key: 'inflation', label: 'Assumed Inflation (%)', type: 'number', defaultValue: 3, isPercent: true },
    ],
    faqs: [
      { question: 'What is the coasting phase?', answer: 'In Coast FIRE, your existing nest egg is left untouched to compound passively. You can shift to lower-paying, lower-stress active work, part-time jobs, or pursue passion projects, since you do not need to save for retirement anymore.' },
      { question: 'Does Coast FIRE assume you keep contributing?', answer: 'No, the defining metric of Coast FIRE is that your active contribution drops to zero, and compound interest does the rest of the heavy lifting.' }
    ],
    calculate: (inputs, currency) => {
      const curAge = inputs.currentAge || 30;
      const retAge = inputs.retirementAge || 60;
      const sav = inputs.currentSavings || 0;
      const exp = inputs.annualExpenses || 40000;
      const ret = (inputs.expectedReturn || 8) / 100;
      const inf = (inputs.inflation || 3) / 100;

      const netRealReturn = ret - inf;
      const yearsToCoast = Math.max(1, retAge - curAge);
      const targetRetirementCorpus = exp * 25; // standard 4% SWR
      const coastFireNumber = targetRetirementCorpus / Math.pow(1 + netRealReturn, yearsToCoast);

      const chartData = [];
      let compoundingPortfolio = sav;
      for (let y = 1; y <= yearsToCoast; y++) {
        compoundingPortfolio = compoundingPortfolio * (1 + netRealReturn);
        chartData.push({
          year: `Age ${curAge + y}`,
          portfolio: Math.round(compoundingPortfolio),
          coastNeeded: Math.round(coastFireNumber * Math.pow(1 + netRealReturn, y)),
        });
      }

      const isCoasted = sav >= coastFireNumber;

      return {
        metrics: [
          { label: 'Your Coast FIRE Number', value: coastFireNumber, isPrimary: true, desc: 'Amount you need in portfolio today' },
          { label: 'Status', value: isCoasted ? 'Fully Coast FIRE!' : 'Savings Gap Remains', desc: isCoasted ? 'Compounding will handle retirement' : 'Increase savings today' },
          { label: 'Target Corpus at Retirement', value: targetRetirementCorpus, desc: 'Needed in retirement at chosen SWR' },
        ],
        chartData,
        explanationText: isCoasted 
          ? `Outstanding! Your current savings of ${sav.toLocaleString()} exceeds your Coast FIRE threshold of ${Math.round(coastFireNumber).toLocaleString()}. You can legally coast immediately.` 
          : `You need an additional ${(coastFireNumber - sav).toLocaleString()} today to transition to Coast FIRE. Or, delay retirement age to allow more time to compound.`
      };
    }
  };
