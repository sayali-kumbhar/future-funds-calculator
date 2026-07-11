import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'investment-goal',
    name: 'Investment Goal Calculator',
    category: 'investing',
    metaTitle: 'Investment Goal Calculator - Plan Custom Corpus Milestones',
    metaDesc: 'Discover the required starting principal or monthly contribution to reach a specific financial goal.',
    primaryKeyword: 'Investment Goal Calculator',
    formulaName: 'Investment Sinking Fund Compound Formula',
    formulaDesc: 'Monthly Savings Needed = [ Goal - Principal × (1+r)^t ] / [ ((1+r)^t - 1) / r ].',
    explanation: 'A goals-focused wealth planner calculating how to build specific assets (e.g., a $250,000 investment balance) over a defined timeframe and expected interest return.',
    example: 'To build a $500,000 portfolio in 15 years starting with $10,000 at a 9% return, you need to save $1,280 each month.',
    relatedSlugs: ['savings-goal', 'compound-interest', 'investment', 'portfolio-allocation'],
    fields: [
      { key: 'targetGoal', label: 'Desired Goal Corpus', type: 'number', defaultValue: 250000, isCurrency: true },
      { key: 'years', label: 'Timeline in Years', type: 'number', defaultValue: 12, min: 1, max: 40 },
      { key: 'startingPrincipal', label: 'Starting Capital Buffer', type: 'number', defaultValue: 10000, isCurrency: true },
      { key: 'expectedRate', label: 'Expected Yield (%)', type: 'number', defaultValue: 9, isPercent: true },
    ],
    faqs: [
      { question: 'Why starting capital is powerful?', answer: 'Starting with a larger principal buffer reduces the required monthly savings load because compounding has a bigger starting balance to work with.' },
      { question: 'What happens if return rates fluctuate?', answer: 'Broad market returns are not straight lines. Long-term models use a conservative average return to build a margin of safety.' }
    ],
    calculate: (inputs, currency) => {
      const target = inputs.targetGoal || 250000;
      const y = inputs.years || 12;
      const principal = inputs.startingPrincipal || 10000;
      const r = (inputs.expectedRate || 9) / 100 / 12;

      const m = y * 12;
      const futureValOfPrincipal = principal * Math.pow(1 + r, m);
      const remainingNeeded = Math.max(0, target - futureValOfPrincipal);

      let monthlySavingNeeded = remainingNeeded / m;
      if (r > 0) {
        monthlySavingNeeded = remainingNeeded * (r / (Math.pow(1 + r, m) - 1));
      }

      const chartData = [];
      let balance = principal;
      for (let month = 1; month <= m; month++) {
        balance = balance * (1 + r) + monthlySavingNeeded;
        if (month % Math.max(1, Math.round(m / 10)) === 0 || month === m) {
          chartData.push({
            name: `Mo ${month}`,
            balance: Math.round(balance),
            goal: target,
          });
        }
      }

      return {
        metrics: [
          { label: 'Required Monthly Investment', value: monthlySavingNeeded, isPrimary: true, desc: 'Amount to invest monthly' },
          { label: 'Lump Sum Compound Subsidies', value: futureValOfPrincipal, desc: 'What starting capital grows to' },
          { label: 'Total Contributions Needed', value: principal + monthlySavingNeeded * m, desc: 'Your cash contributions' },
        ],
        chartData,
        explanationText: `To amass a target of ${target.toLocaleString()} in ${y} years, you need to systematically deposit ${Math.round(monthlySavingNeeded).toLocaleString()} monthly into an account yielding ${inputs.expectedRate}%.`
      };
    }
  };
