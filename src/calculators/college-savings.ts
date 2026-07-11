import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'college-savings',
    name: 'College Savings Calculator',
    category: 'savings_budget',
    metaTitle: 'College Savings Calculator - Plan Education Funding',
    metaDesc: 'Plan educational budgets and calculate monthly savings required to fund your children’s higher education.',
    primaryKeyword: 'College Savings Calculator',
    formulaName: 'Educational Future Cost Inflation Formula',
    formulaDesc: 'Future Cost = Present Cost × (1 + Inflation Rate)^Years.',
    explanation: 'College costs rise significantly faster than general consumer goods. This tool projects future college costs adjusted for inflation and determines your monthly savings needs.',
    example: 'Tuition that costs $40,000 today will cost approximately $96,000 in 15 years under an annual education inflation model of 6%.',
    relatedSlugs: ['savings-goal', 'budget', 'future-value', 'inflation'],
    fields: [
      { key: 'currentCost', label: 'Current Year Tuition Cost', type: 'number', defaultValue: 40000, isCurrency: true },
      { key: 'yearsUntilCollege', label: 'Years Until Child Starts College', type: 'number', defaultValue: 15, min: 1, max: 20 },
      { key: 'currentSaved', label: 'Already Saved for College', type: 'number', defaultValue: 5000, isCurrency: true },
      { key: 'expectedYield', label: 'Expected Return Rate (%)', type: 'number', defaultValue: 8, isPercent: true },
    ],
    faqs: [
      { question: 'Why does college cost inflate so fast?', answer: 'Administrative overhead, rising campus costs, and growing demand historically expand college tuition costs faster than normal CPI inflation.' },
      { question: 'What is a 529 Plan?', answer: 'A US tax-advantaged savings plan designed to encourage saving for future education costs. High-equity allocations are standard for young children, shifting to stable cash as they approach college.' }
    ],
    calculate: (inputs, currency) => {
      const cost = inputs.currentCost || 40000;
      const y = inputs.yearsUntilCollege || 15;
      const saved = inputs.currentSaved || 5000;
      const r = (inputs.expectedYield || 8) / 100 / 12;

      const eduInflation = 0.055;
      const futureCost = cost * Math.pow(1 + eduInflation, y);
      const futureValOfSaved = saved * Math.pow(1 + r * 12, y);

      const remainingNeeded = Math.max(0, futureCost - futureValOfSaved);
      const m = y * 12;
      let monthlyNeeded = remainingNeeded / m;

      if (r > 0) {
        monthlyNeeded = remainingNeeded * (r / (Math.pow(1 + r, m) - 1));
      }

      const chartData = [];
      let balance = saved;
      for (let month = 1; month <= m; month++) {
        balance = balance * (1 + r) + monthlyNeeded;
        if (month % Math.max(1, Math.round(m / 10)) === 0 || month === m) {
          chartData.push({
            name: `Mo ${month}`,
            savings: Math.round(balance),
            targetCost: futureCost,
          });
        }
      }

      return {
        metrics: [
          { label: 'Required Monthly Savings', value: monthlyNeeded, isPrimary: true, desc: 'What you must save monthly' },
          { label: 'Inflation-Adjusted Future Cost', value: futureCost, desc: 'Cost of tuition in future years' },
          { label: 'Compound Value of Current Savings', value: futureValOfSaved, desc: 'What existing buffer grows to' },
        ],
        chartData,
        explanationText: `Adjusting for tuition price inflation, your targeted college fund expands to ${futureCost.toLocaleString()} in ${y} years, requiring a systematic deposit of ${Math.round(monthlyNeeded).toLocaleString()} monthly.`
      };
    }
  };
