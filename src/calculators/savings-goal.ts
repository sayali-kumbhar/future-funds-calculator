import { CalculatorConfig } from '../types/calculator';

export const calculator: CalculatorConfig = {
    slug: 'savings-goal',
    name: 'Savings Goal Calculator',
    category: 'savings_budget',
    metaTitle: 'Savings Goal Calculator - Plan Funding Milestones',
    metaDesc: 'Calculate the exact monthly deposit size required to achieve a custom target savings goal within a specific timeline.',
    primaryKeyword: 'Savings Goal Calculator',
    formulaName: 'Sinking Fund Formula',
    formulaDesc: 'Monthly Deposit = Target × [ r / ((1 + r)^n - 1) ].',
    explanation: 'A savings goal or sinking fund planner works backwards from a future price tag (e.g., house downpayment, travel budget list) to determine your required monthly savings frequency.',
    example: 'To amass a $30,000 down payment in 3 years at 4% yield, you need to save approximately $785 per month.',
    relatedSlugs: ['emergency-fund', 'budget', 'vacation-savings', 'future-value'],
    fields: [
      { key: 'targetAmount', label: 'Target Savings Goal', type: 'number', defaultValue: 50000, isCurrency: true },
      { key: 'months', label: 'Timeline in Months', type: 'number', defaultValue: 24, min: 1, max: 240 },
      { key: 'currentBuffer', label: 'Current Savings Buffer', type: 'number', defaultValue: 5000, isCurrency: true },
      { key: 'yieldRate', label: 'Annual Savings Yield (%)', type: 'number', defaultValue: 4.5, isPercent: true },
    ],
    faqs: [
      { question: 'What is a Sinking Fund?', answer: 'A strategic category of savings set aside for a specific future cash outflow, separate from your primary emergency fund, to prevent budget disruption.' },
      { question: 'Is high-yield cash appropriate for savings goals?', answer: 'Yes. For short timelines (under 3 years), keeping savings in FDIC-insured high-yield accounts shields your capital from stock market corrections.' }
    ],
    calculate: (inputs, currency) => {
      const target = inputs.targetAmount || 50000;
      const m = inputs.months || 24;
      const current = inputs.currentBuffer || 0;
      const r = (inputs.yieldRate || 4.5) / 100 / 12;

      const remainingNeeded = target - current * Math.pow(1 + r * 12, m / 12);
      let monthlyNeeded = remainingNeeded / m;

      if (r > 0) {
        monthlyNeeded = remainingNeeded * (r / (Math.pow(1 + r, m) - 1));
      }

      if (monthlyNeeded < 0) monthlyNeeded = 0;

      const chartData = [];
      let balance = current;
      for (let month = 1; month <= m; month++) {
        balance = balance * (1 + r) + monthlyNeeded;
        if (month % Math.max(1, Math.round(m / 10)) === 0 || month === m) {
          chartData.push({
            name: `Mo ${month}`,
            balance: Math.round(balance),
            target: target,
          });
        }
      }

      return {
        metrics: [
          { label: 'Required Monthly Savings', value: monthlyNeeded, isPrimary: true, desc: 'What you must save each month' },
          { label: 'Remaining Savings Needed', value: Math.max(0, target - current), desc: 'Raw gap to clear' },
          { label: 'Compound Yield Earned', value: Math.max(0, target - (current + monthlyNeeded * m)), desc: 'Interest subsidizing your goal' },
        ],
        chartData,
        explanationText: `To achieve your target of ${target.toLocaleString()} in ${m} months, you need to systematically deposit ${Math.round(monthlyNeeded).toLocaleString()} monthly into an account yielding ${inputs.yieldRate}%.`
      };
    }
  };
